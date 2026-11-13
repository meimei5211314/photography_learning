const { test } = require('node:test');
const assert = require('node:assert/strict');
const { exposureEV, horizontalFov } = require('../labs.js');

test('EV100 match gives zero offset; ISO increase is one output stop', () => {
  const ev = Math.log2(8 * 8 / (1 / 125));
  assert.ok(Math.abs(exposureEV(8, 1 / 125, 100, ev)) < 1e-10);
  assert.ok(Math.abs(exposureEV(8, 1 / 125, 200, ev) - 1) < 1e-10);
});
test('doubling exposure time adds one stop and halving aperture number adds two', () => {
  const base = exposureEV(8, 1 / 125, 100, 13);
  assert.ok(Math.abs(exposureEV(8, 2 / 125, 100, 13) - base - 1) < 1e-10);
  assert.ok(Math.abs(exposureEV(4, 1 / 125, 100, 13) - base - 2) < 1e-10);
});
test('changing aperture can compensate a two-stop faster shutter', () => {
  assert.ok(Math.abs(exposureEV(4, 1 / 500, 100, 13) - exposureEV(8, 1 / 125, 100, 13)) < 1e-10);
});
test('one stop brighter scene gives one stop brighter output', () => {
  assert.ok(Math.abs(exposureEV(8, 1 / 125, 100, 14) - exposureEV(8, 1 / 125, 100, 13) - 1) < 1e-10);
});
test('longer lenses narrow angle; smaller sensors narrow angle', () => {
  assert.ok(horizontalFov(24) > horizontalFov(50));
  assert.ok(horizontalFov(50) > horizontalFov(85));
  assert.ok(horizontalFov(50, 24) < horizontalFov(50, 36));
  assert.ok(Math.abs(horizontalFov(18) - 90) < 1e-10);
});
test('rejects invalid physical inputs', () => {
  assert.throws(() => exposureEV(0, 1, 100, 10), RangeError);
  assert.throws(() => exposureEV(4, NaN, 100, 10), RangeError);
  assert.throws(() => horizontalFov(-24), RangeError);
});
