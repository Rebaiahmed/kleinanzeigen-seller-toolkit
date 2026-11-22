import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePrice, PRICE_RULES } from '../src/price.ts';

test('uses the documented condition and age factors', () => {
  const result = estimatePrice({ purchasePrice: 1000, condition: 'gut', ageYears: 2 });
  const midpoint = 1000 * PRICE_RULES.condition.gut * PRICE_RULES.yearlyRetention ** 2;
  assert.equal(result.midpoint, Math.round(midpoint));
  assert.equal(result.low, Math.round(midpoint * 0.85));
  assert.equal(result.high, Math.round(midpoint * 1.15));
});

test('older or poorer-condition items cannot yield a higher estimate', () => {
  const newer = estimatePrice({ purchasePrice: 500, condition: 'sehrGut', ageYears: 1 });
  const older = estimatePrice({ purchasePrice: 500, condition: 'sehrGut', ageYears: 8 });
  const damaged = estimatePrice({ purchasePrice: 500, condition: 'defekt', ageYears: 1 });
  assert.ok(newer.midpoint > older.midpoint);
  assert.ok(newer.midpoint > damaged.midpoint);
});

test('age factor has a floor and a valid target is classified against the range', () => {
  const estimate = estimatePrice({ purchasePrice: 100, condition: 'gut', ageYears: 50, targetPrice: 100 });
  assert.equal(estimate.ageFactor, PRICE_RULES.minimumAgeFactor);
  assert.equal(estimate.targetPosition, 'above');
  assert.equal(estimatePrice({ purchasePrice: 100, condition: 'gut', ageYears: 0, targetPrice: 0 }).targetPosition, 'below');
});

test('rejects invalid amounts, ages, and conditions', () => {
  assert.throws(() => estimatePrice({ purchasePrice: 0, condition: 'gut', ageYears: 2 }), RangeError);
  assert.throws(() => estimatePrice({ purchasePrice: Number.NaN, condition: 'gut', ageYears: 2 }), RangeError);
  assert.throws(() => estimatePrice({ purchasePrice: 100, condition: 'gut', ageYears: -1 }), RangeError);
  assert.throws(() => estimatePrice({ purchasePrice: 100, condition: 'gut', ageYears: 1, targetPrice: -5 }), RangeError);
  assert.throws(() => estimatePrice({ purchasePrice: 100, condition: 'fantastisch' as never, ageYears: 1 }), RangeError);
});
