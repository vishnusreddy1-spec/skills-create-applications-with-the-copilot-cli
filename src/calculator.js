#!/usr/bin/env node

// Node.js CLI Calculator
// Supported operations:
//  - add  (alias: +)  => addition
//  - sub  (alias: -)  => subtraction
//  - mul  (alias: *, x) => multiplication
//  - div  (alias: /)  => division
//
// Usage examples:
//   node src/calculator.js add 3 5    # 8
//   node src/calculator.js sub 10 4   # 6
//   node src/calculator.js mul 6 7    # 42
//   node src/calculator.js div 20 4   # 5
//
// Exits with status 0 on success, non-zero on error.

function printHelp() {
  console.log(`Usage: calculator.js <operation> <a> <b>

Operations (names and aliases):
  add   | +    : addition
  sub   | -    : subtraction
  mul   | * | x: multiplication
  div   | /    : division
  mod   | %    : modulo (remainder)
  pow   | ^ | **: exponentiation (power)
  sqrt  | √    : square root (unary)

Examples:
  node src/calculator.js add 3 5
  node src/calculator.js + 2 4
  node src/calculator.js div 10 2
  node src/calculator.js mod 10 3
  node src/calculator.js pow 2 8
  node src/calculator.js sqrt 9

Flags:
  -h, --help    Show this help message
`);
}

function isNumeric(value) {
  return !Number.isNaN(Number(value)) && Number.isFinite(Number(value));
}

function normalizeOp(op) {
  if (!op) return null;
  const mapping = {
    '+': 'add',
    'add': 'add',
    'plus': 'add',
    '-': 'sub',
    'sub': 'sub',
    'subtract': 'sub',
    '*': 'mul',
    'x': 'mul',
    'X': 'mul',
    'mul': 'mul',
    'multiply': 'mul',
    '/': 'div',
    'div': 'div',
    'divide': 'div',
    '%': 'mod',
    'mod': 'mod',
    'modulo': 'mod',
    '^': 'pow',
    '**': 'pow',
    'pow': 'pow',
    'power': 'pow',
    'sqrt': 'sqrt',
    '√': 'sqrt'
  };
  return mapping[op.toString().toLowerCase()] || null;
}

// New helper functions
function modulo(a, b) {
  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) throw new Error('square root of negative number');
  return Math.sqrt(n);
}

function compute(op, a, b) {
  switch (op) {
    case 'add':
      return a + b;
    case 'sub':
      return a - b;
    case 'mul':
      return a * b;
    case 'div':
      return a / b;
    case 'mod':
      return modulo(a, b);
    case 'pow':
      return power(a, b);
    case 'sqrt':
      // unary operation: ignore b
      return squareRoot(a);
    default:
      throw new Error('Unsupported operation: ' + op);
  }
}

function main(argv) {
  if (argv.includes('-h') || argv.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  const [opRaw, aRaw, bRaw] = argv;
  if (!opRaw) {
    console.error('Error: missing operation.');
    printHelp();
    process.exit(2);
  }

  const op = normalizeOp(opRaw);
  if (!op) {
    console.error(`Error: unknown operation "${opRaw}".`);
    printHelp();
    process.exit(2);
  }

  // Unary operations (only one operand required)
  const unaryOps = new Set(['sqrt']);

  if (unaryOps.has(op)) {
    if (aRaw === undefined) {
      console.error('Error: missing operand for unary operation.');
      printHelp();
      process.exit(2);
    }
    if (!isNumeric(aRaw)) {
      console.error('Error: operand must be numeric.');
      process.exit(2);
    }

    const a = Number(aRaw);

    if (op === 'sqrt' && a < 0) {
      console.error('Error: square root of negative number');
      process.exit(4);
    }

    const result = compute(op, a);
    console.log(result);
    process.exit(0);
  }

  // Binary operations
  if (aRaw === undefined || bRaw === undefined) {
    console.error('Error: missing arguments.');
    printHelp();
    process.exit(2);
  }

  if (!isNumeric(aRaw) || !isNumeric(bRaw)) {
    console.error('Error: both operands must be numeric.');
    process.exit(2);
  }

  const a = Number(aRaw);
  const b = Number(bRaw);

  if ((op === 'div' || op === 'mod') && b === 0) {
    console.error('Error: division/modulo by zero');
    process.exit(3);
  }

  const result = compute(op, a, b);
  console.log(result);
  process.exit(0);
}

// Accept args after the script name (i.e., process.argv.slice(2))
if (require.main === module) {
  main(process.argv.slice(2));
}

// Export functions for unit testing
module.exports = {
  compute,
  normalizeOp,
  isNumeric,
  printHelp,
  main,
  // exported helpers
  modulo,
  power,
  squareRoot
};
