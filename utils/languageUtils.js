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

export { detectLanguage, isJavaScriptOperator, isJavaOperator, isCppOperator };
