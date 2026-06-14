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

Examples:
  node src/calculator.js add 3 5
  node src/calculator.js + 2 4
  node src/calculator.js div 10 2

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
    'divide': 'div'
  };
  return mapping[op.toString().toLowerCase()] || null;
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
  if (!opRaw || aRaw === undefined || bRaw === undefined) {
    console.error('Error: missing arguments.');
    printHelp();
    process.exit(2);
  }

  const op = normalizeOp(opRaw);
  if (!op) {
    console.error(`Error: unknown operation "${opRaw}".`);
    printHelp();
    process.exit(2);
  }

  if (!isNumeric(aRaw) || !isNumeric(bRaw)) {
    console.error('Error: both operands must be numeric.');
    process.exit(2);
  }

  const a = Number(aRaw);
  const b = Number(bRaw);

  if (op === 'div' && b === 0) {
    console.error('Error: division by zero');
    process.exit(3);
  }

  const result = compute(op, a, b);

  // Print result to stdout (suitable for piping)
  console.log(result);
  process.exit(0);
}

// Accept args after the script name (i.e., process.argv.slice(2))
if (require.main === module) {
  main(process.argv.slice(2));
}
