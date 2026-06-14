const { spawnSync } = require('child_process');
const path = require('path');
const calc = require('../calculator');

const node = process.execPath;
const script = path.resolve(__dirname, '..', 'calculator.js');

describe('calculator functions', () => {
  test('compute: addition', () => {
    expect(calc.compute('add', 2, 3)).toBe(5);
  });

  test('compute: subtraction', () => {
    expect(calc.compute('sub', 10, 4)).toBe(6);
  });

  test('compute: multiplication', () => {
    expect(calc.compute('mul', 45, 2)).toBe(90);
  });

  test('compute: division', () => {
    expect(calc.compute('div', 20, 5)).toBe(4);
  });

  test('isNumeric true/false', () => {
    expect(calc.isNumeric('123')).toBe(true);
    expect(calc.isNumeric('abc')).toBe(false);
  });

  test('normalizeOp aliases', () => {
    expect(calc.normalizeOp('+')).toBe('add');
    expect(calc.normalizeOp('x')).toBe('mul');
    expect(calc.normalizeOp('/')).toBe('div');
  });
});

describe('calculator CLI', () => {
  test('CLI: 2 + 3 outputs 5', () => {
    const r = spawnSync(node, [script, '+', '2', '3'], { encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('5');
  });

  test('CLI: 10 - 4 outputs 6', () => {
    const r = spawnSync(node, [script, '-', '10', '4'], { encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('6');
  });

  test('CLI: 45 * 2 outputs 90', () => {
    const r = spawnSync(node, [script, '*', '45', '2'], { encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('90');
  });

  test('CLI: 20 / 5 outputs 4', () => {
    const r = spawnSync(node, [script, '/', '20', '5'], { encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('4');
  });

  test('CLI: division by zero exits with code 3 and prints error', () => {
    const r = spawnSync(node, [script, 'div', '5', '0'], { encoding: 'utf8' });
    expect(r.status).toBe(3);
    expect(r.stderr).toMatch(/division by zero/i);
  });

  test('CLI: invalid operator exits non-zero', () => {
    const r = spawnSync(node, [script, 'pow', '2', '3'], { encoding: 'utf8' });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/unknown operation/i);
  });

  test('CLI: non-numeric operand exits non-zero', () => {
    const r = spawnSync(node, [script, 'add', 'a', '3'], { encoding: 'utf8' });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/operands must be numeric/i);
  });
});
