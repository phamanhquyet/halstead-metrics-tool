import { isJavaScriptOperator, isJavaOperator, isCppOperator } from './languageUtils.js';

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

export { calculateHalsteadMetrics, calculateOperands };
