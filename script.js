window.jsPDF = window.jspdf.jsPDF;

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (event) => reject(new Error('Error reading file.'));
    reader.readAsText(file);
  });
}

async function handleFileUpload(event) {
  event.preventDefault();
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file.');
    return;
  }

  try {
    const code = await readFile(file);
    const language = detectLanguage(code);
    const metrics = calculateHalsteadMetrics(code, language);
    displayResults(metrics);
    displayCode(code);
  } catch (error) {
    alert(`An error occurred while reading the file: ${error.message}`);
  }
}

function displayResults(metrics) {
  const resultsContainer = document.getElementById('results');

  // Clear previous results
  resultsContainer.innerHTML = '';

  // Create and append the text results
  const textResults = document.createElement('div');
  textResults.innerHTML = `
    <p>n1 (number of distinct operands): ${metrics.n1}</p>
    <p>n2 (number of distinct operators): ${metrics.n2}</p>
    <p>N(total number of operands and operators combined): ${metrics.N}</p>
    <p>n (total number of unique operators and operands): ${metrics.n}</p>
    <p>Difficulty ((n1/2) * (N2/n2)): ${metrics.difficulty}</p>
    <p>Volume (N*log2(n)): ${Math.round(metrics.volume * 100) / 100}</p>
    <p>Effort (Volume*Difficulty): ${Math.round(metrics.effort * 100) / 100}</p>
    <p>Time (effort / 18): ${Math.round(metrics.time * 100) / 100} seconds</p>
  `;

  // The formula "time = effort / 18" is derived from the empirical observation made by Maurice H. Halstead,
  // the creator of Halstead metrics.
  // In his research, Halstead proposed that effort can be estimated based on the number of operators and operands in a program.
  // He suggested that the effort required to write a program is proportional to the product of program length (N) and program difficulty (D).
  resultsContainer.appendChild(textResults);

  // Create and display the chart
  const chartCanvas = document.getElementById('chart');
  const chartContext = chartCanvas.getContext('2d');

  const chartData = {
    labels: ['n1', 'n2', 'N', 'n', 'Difficulty', 'Volume', 'Effort', 'Time'],
    datasets: [
      {
        label: 'Halstead Metrics',
        data: [metrics.n1, metrics.n2, metrics.N, metrics.n, metrics.difficulty, metrics.volume, metrics.effort, metrics.time],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  new Chart(chartContext, {
    type: 'line',
    data: chartData,
    options: chartOptions,
  });
}

function displayCode(code) {
  const codeDisplay = document.querySelector('#code-display');
  codeDisplay.innerHTML = `<pre><code class="language-javascript">${Prism.highlight(code, Prism.languages.javascript, 'javascript')}</code></pre>`;
}

function calculateHalsteadMetrics(code, language) {
  const operators = new Set();
  const operands = new Set();
  const tokens = code.split(/\s+/);
  if (language == 'javascript') {
    for (let token of tokens) {
      if (isJavaScriptOperator(token)) {
        operators.add(token);
      } else {
        operands.add(token);
      }
    }
  } else if (language == 'java') {
    for (let token of tokens) {
      if (isJavaOperator(token)) {
        operators.add(token);
      } else {
        operands.add(token);
      }
    }
  }

  const n1 = calculateOperands(code, language);
  const n2 = operators.size;

  // Calculate program length and vocabulary size
  const N = tokens.length;
  const n = n1 + n2;

  // Calculate program difficulty and volume
  const difficulty = (n1 / 2) * (n2 / n1);
  const volume = N * Math.log2(n);

  // Calculate program effort and time
  const effort = difficulty * volume;
  const time = effort / 18;
  console.log(language);
  return {
    n1,
    n2,
    N,
    n,
    difficulty,
    volume,
    effort,
    time,
  };
}

function exportToPDF() {
  const doc = new jsPDF();

  // Code Snippet
  const codeSnippet = document.getElementById('code-display');
  const codeText = codeSnippet.textContent.trim();
  doc.setFontSize(12);
  doc.text(20, 20, 'Code Snippet:');
  doc.setFont('consolas');
  doc.setFontSize(10);
  doc.text(20, 30, codeText, { maxWidth: 170 });

  // Results
  const resultsContainer = document.getElementById('results');
  const resultsText = resultsContainer.textContent.trim();
  const resultsY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 45;
  doc.setFont('helvetica');
  doc.setFontSize(12);
  doc.text(20, resultsY, 'Results:');
  doc.setFontSize(10);
  doc.text(20, resultsY + 7, resultsText, { maxWidth: 170 });

  // Graph
  const chartCanvas = document.getElementById('chart');
  const chartDataUrl = chartCanvas.toDataURL('image/jpeg', 1.0);
  doc.addPage();
  doc.text(20, 20, 'Graph:');
  doc.addImage(chartDataUrl, 'JPEG', 20, 30, 170, 100);

  // Save the PDF file
  doc.save('halstead_metrics.pdf');
}

function calculateOperands(code, language) {
  const operandPatterns = {
    javascript: /[a-zA-Z_$][a-zA-Z0-9_$]*/g,
    java: /[a-zA-Z_$][a-zA-Z0-9_$]*/g,
    cpp: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,
  };

  const operandPattern = operandPatterns[language];
  const matches = code.match(operandPattern);
  const operands = new Set(matches);
  return operands.size;
}

function detectLanguage(code) {
  if (code.includes('public class')) {
    return 'java';
  } else if (code.includes('int main(')) {
    return 'cpp';
  } else {
    return 'javascript';
  }
}

function isJavaScriptOperator(token) {
  // Arithmetic Operators
  const arithmeticOperators = ['+', '-', '*', '/', '%', '++', '--'];

  // Assignment Operators
  const assignmentOperators = ['=', '+=', '-=', '*=', '/=', '%=', '**=', '&=', '|=', '^=', '<<=', '>>=', '>>>='];

  // Comparison Operators
  const comparisonOperators = ['==', '!=', '===', '!==', '>', '>=', '<', '<='];

  // Logical Operators
  const logicalOperators = ['&&', '||', '!'];

  // Bitwise Operators
  const bitwiseOperators = ['&', '|', '^', '~', '<<', '>>', '>>>'];

  // Ternary Operator
  const ternaryOperator = ['?', ':'];

  // typeof Operator
  const typeofOperator = ['typeof'];

  // instanceof Operator
  const instanceofOperator = ['instanceof'];

  // Delete Operator
  const deleteOperator = ['delete'];

  // Void Operator
  const voidOperator = ['void'];

  // in Operator
  const inOperator = ['in'];

  // Concatenate all operators
  const allJSOperators = [...arithmeticOperators, ...assignmentOperators, ...comparisonOperators, ...logicalOperators, ...bitwiseOperators, ...ternaryOperator, ...typeofOperator, ...instanceofOperator, ...deleteOperator, ...voidOperator, ...inOperator];
  return allJSOperators.includes(token);
}

function isJavaOperator(token) {
  // Arithmetic Operators
  const arithmeticOperators = ['+', '-', '*', '/', '%', '++', '--'];

  // Assignment Operators
  const assignmentOperators = ['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^='];

  // Comparison Operators
  const comparisonOperators = ['==', '!=', '>', '>=', '<', '<='];

  // Logical Operators
  const logicalOperators = ['&&', '||', '!'];

  // Bitwise Operators
  const bitwiseOperators = ['&', '|', '^', '~', '<<', '>>', '>>>'];

  // Ternary Operator
  const ternaryOperator = ['? :'];

  // instanceof Operator
  const instanceofOperator = ['instanceof'];

  // Concatenate all operators
  const allJavaOperators = [...arithmeticOperators, ...assignmentOperators, ...comparisonOperators, ...logicalOperators, ...bitwiseOperators, ...ternaryOperator, ...instanceofOperator];
  return allJavaOperators.includes(token);
}

function isCppOperator(token) {
  // Arithmetic Operators
  const arithmeticOperators = ['+', '-', '*', '/', '%', '++', '--'];

  // Assignment Operators
  const assignmentOperators = ['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '|=', '^='];

  // Comparison Operators
  const comparisonOperators = ['==', '!=', '>', '>=', '<', '<='];

  // Logical Operators
  const logicalOperators = ['&&', '||', '!'];

  // Bitwise Operators
  const bitwiseOperators = ['&', '|', '^', '~', '<<', '>>'];

  // Ternary Operator
  const ternaryOperator = ['? :'];

  // Conditional Operator
  const conditionalOperator = ['?'];

  // Pointer Operator
  const pointerOperator = ['*', '&'];

  // sizeof Operator
  const sizeofOperator = ['sizeof'];

  // Concatenate all operators
  const allCppOperators = [...arithmeticOperators, ...assignmentOperators, ...comparisonOperators, ...logicalOperators, ...bitwiseOperators, ...ternaryOperator, ...conditionalOperator, ...pointerOperator, ...sizeofOperator];
  return allCppOperators.includes(token);
}
const form = document.querySelector('form');
const textarea = form.querySelector('textarea');
const fileInput = form.querySelector('input[type="file"]');
const results = document.querySelector('#results');
const exportButton = document.getElementById('export-button');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const code = textarea.value.trim();
  if (!code) {
    alert('Please enter some code.');
    return;
  }
  try {
    const language = detectLanguage(code);
    const metrics = calculateHalsteadMetrics(code, language);
    displayResults(metrics);
  } catch (error) {
    alert(`An error occurred: ${error.message}`);
  }
});

fileInput.addEventListener('change', handleFileUpload);
exportButton.addEventListener('click', exportToPDF);
