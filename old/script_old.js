//done
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
    displayResults(file.name, code, metrics);
    displayCode(code);
  } catch (error) {
    alert(`An error occurred while reading the file: ${error.message}`);
  }
}

async function handleFolderUpload(event) {
  event.preventDefault();
  const folderInput = document.getElementById('folder-input');
  const files = folderInput.files;
  if (files.length === 0) {
    alert('Please select a folder.');
    return;
  }

  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.type !== 'text/javascript' && file.type !== 'text/java' && file.type !== 'text/plain') {
      alert(`Invalid file type: ${file.name}`);
      continue;
    }

    try {
      const code = await readFile(file);
      const language = detectLanguage(code);
      const metrics = calculateHalsteadMetrics(code, language);
      displayResults(file.name, code, metrics);
      displayCode(code);
    } catch (error) {
      alert(`An error occurred while reading the file: ${error.message}`);
    }
  }
}
//done
function displayResults(filename, code, metrics) {
  // const resultsContainer = document.createElement('div');
  // resultsContainer.setAttribute('id', 'results');
  const resultsContainer = document.getElementById('results');
  resultsContainer.style.display = 'block';

  // Clear previous results
  resultsContainer.innerHTML = '';

  // Create table element
  const table = document.createElement('table');
  table.classList.add('results-table');

  // Create table headers
  const headers = ['Metric', 'Value'];
  const headerRow = document.createElement('tr');
  for (const header of headers) {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Create table rows for each metric
  const metricsData = [
    { label: 'Filename', value: filename },
    { label: 'Programming Language', value: metrics.language },
    { label: 'n1 (number of distinct operands)', value: metrics.n1 },
    { label: 'n2 (number of distinct operators)', value: metrics.n2 },
    { label: 'N (total number of operands and operators combined)', value: metrics.N },
    { label: 'n (total number of unique operators and operands)', value: metrics.n },
    { label: 'Difficulty ((n1/2) * (N2/n2))', value: metrics.difficulty },
    { label: 'Volume (N*log2(n))', value: metrics.volume },
    { label: 'Effort (Volume*Difficulty)', value: metrics.effort },
    { label: 'Time (effort / 18)', value: metrics.time + ' seconds' },
  ];

  for (const metric of metricsData) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    const valueCell = document.createElement('td');
    labelCell.textContent = metric.label;
    valueCell.textContent = metric.value;
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }

  // Append the table to the results container
  resultsContainer.appendChild(table);

  // The formula "time = effort / 18" is derived from the empirical observation made by Maurice H. Halstead,
  // the creator of Halstead metrics.
  // In his research, Halstead proposed that effort can be estimated based on the number of operators and operands in a program.
  // He suggested that the effort required to write a program is proportional to the product of program length (N) and program difficulty (D).

  // Create the export button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export to Excel';
  exportButton.addEventListener('click', () => exportToExcel(filename, code, metrics));
  resultsContainer.appendChild(exportButton);
}
//done
// Export results to Excel
function exportToExcel(filename, code, metrics) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Filename', 'Code', 'n1', 'n2', 'N', 'n', 'Difficulty', 'Volume', 'Effort', 'Time'],
    [filename, code, metrics.n1, metrics.n2, metrics.N, metrics.n, metrics.difficulty, metrics.volume, metrics.effort, metrics.time],
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
  XLSX.writeFile(workbook, 'results.xlsx');
}

function displayCode(code) {
  const codeDisplay = document.querySelector('#code-display');
  codeDisplay.innerHTML = `<pre><code class="language-javascript">${Prism.highlight(code, Prism.languages.javascript, 'javascript')}</code></pre>`;
}
//done
function calculateHalsteadMetrics(code, language) {
  const operators = new Set();
  const operands = new Set();
  code = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
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
  } else if (language == 'cpp') {
    for (let token of tokens) {
      if (isCppOperator(token)) {
        operators.add(token);
      } else {
        operands.add(token);
      }
    }
  }
  let n1 = calculateOperands(code, language);
  let n2 = operators.size;

  // Calculate program length and vocabulary size
  let N = tokens.length;
  let n = n1 + n2;

  // Calculate program difficulty and volume
  let difficulty = (n1 / 2) * (n2 / n1);
  let volume = N * Math.log2(n);

  // Calculate program effort and time
  let effort = difficulty * volume;
  let time = effort / 18;
  console.log(language);
  volume = Math.round(volume * 100) / 100;
  effort = Math.round(effort * 100) / 100;
  time = Math.round(time * 100) / 100;
  return {
    n1,
    n2,
    N,
    n,
    difficulty,
    volume,
    effort,
    time,
    language,
  };
}
//done
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
//done
function detectLanguage(code) {
  if (code.includes('public class')) {
    return 'java';
  } else if (code.includes('int main(')) {
    return 'cpp';
  } else {
    return 'javascript';
  }
}
//done
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
//done
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
//done
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
    document.getElementById('code-display').style.display = 'none';
    const language = detectLanguage(code);
    const metrics = calculateHalsteadMetrics(code, language);
    displayResults(null, null, metrics);
  } catch (error) {
    alert(`An error occurred: ${error.message}`);
  }
});

fileInput.addEventListener('change', handleFileUpload);
// exportButton.addEventListener('click', exportToPDF);

const folderUploadButton = document.getElementById('upload-folder');
folderUploadButton.addEventListener('click', handleFolderUpload);

const folderInput = document.getElementById('folder-input');
folderInput.addEventListener('change', handleFolderUpload);
