function calculateHalsteadMetrics(code) {
  // Count unique operators and operands
  const operators = new Set();
  const operands = new Set();
  const tokens = code.split(/\s+/);
  for (let token of tokens) {
    if (isOperator(token)) {
      operators.add(token);
    } else {
      operands.add(token);
    }
  }
  const n1 = operands.size;
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

  // Calculate vocabulary size and program length
  const vocabularySize = n1 + n2;
  const programLength = tokens.length;
  return {
    n1,
    n2,
    N,
    n,
    difficulty,
    volume,
    effort,
    time,
    vocabularySize,
    programLength
  };
}

function isOperator(token) {
    const operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||'];
    return operators.includes(token);
  }

const form = document.querySelector('form');
const textarea = form.querySelector('textarea');
const results = document.querySelector('#results');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const code = textarea.value.trim();
  if (!code) {
    alert('Please enter some code.');
    return;
  }
  try {
    const metrics = calculateHalsteadMetrics(code);
    results.innerHTML = `
        <p>n1: ${metrics.n1}</p>
        <p>n2: ${metrics.n2}</p>
        <p>N: ${metrics.N}</p>
        <p>n: ${metrics.n}</p>
        <p>Difficulty: ${metrics.difficulty}</p>
        <p>Volume: ${metrics.volume}</p>
        <p>Effort: ${metrics.effort}</p>
        <p>Time: ${metrics.time} seconds</p>
      `;
  } catch (error) {
    alert(`An error occurred: ${error.message}`);
  }
});

if (!results) {
  console.error('Could not find results element.');
}
