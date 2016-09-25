// unit tests for functions in util.js
'use strict';

const { assert } = require('chai');
const { suite, test } = require('mocha');
const { formatTime, hitTest } = require('../app/components/utils');

suite('formatTime', () => {
  test('handles zero', () => {
    const actual = formatTime(0);
    const expected = '0:00:00';

    assert.strictEqual(actual, expected);
  });
  test('handles 60s', () => {
    const actual = formatTime(60);
    const expected = '0:01:00';

    assert.strictEqual(actual, expected);
  });
  test('handles 61s', () => {
    const actual = formatTime(61);
    const expected = '0:01:01';

    assert.strictEqual(actual, expected);
  });
  test('handles 3599s', () => {
    const actual = formatTime(3599);
    const expected = '0:59:59';

    assert.strictEqual(actual, expected);
  });
  test('handles 3600s', () => {
    const actual = formatTime(3600);
    const expected = '1:00:00';

    assert.strictEqual(actual, expected);
  });
  test('handles 3601s', () => {
    const actual = formatTime(3601);
    const expected = '1:00:01';

    assert.strictEqual(actual, expected);
  });
  test('handles 9999s', () => {
    const actual = formatTime(9999);
    const expected = '2:46:39';

    assert.strictEqual(actual, expected);
  });
});

suite('hitTest', () => {
  test('centered', () => {
    const mx = 0;
    const my = 0;
    const piece = { x: 0, y: 0, rot: 0 };
    const pieceContentSize = 10;
    const actual = hitTest(mx, my, piece, pieceContentSize);
    const expected = true;

    assert.strictEqual(actual, expected);
  });
  test('upper left corner', () => {
    const pieceContentSize = 10;
    const mx = -pieceContentSize / 2;
    const my = -pieceContentSize / 2;
    const piece = { x: 0, y: 0, rot: 0 };
    const actual = hitTest(mx, my, piece, pieceContentSize);
    const expected = true;

    assert.strictEqual(actual, expected);
  });
  test('lower right corner', () => {
    const pieceContentSize = 10;
    const mx = pieceContentSize / 2;
    const my = pieceContentSize / 2;
    const piece = { x: 0, y: 0, rot: 0 };
    const actual = hitTest(mx, my, piece, pieceContentSize);
    const expected = false; // hit test is on half-open interval

    assert.strictEqual(actual, expected);
  });
  test('inside, rot 90', () => {
    const pieceContentSize = 10;
    const mx = -4;
    const my = -4;
    const piece = { x: 0, y: 0, rot: 90 };
    const actual = hitTest(mx, my, piece, pieceContentSize);
    const expected = true;

    assert.strictEqual(actual, expected);
  });
  test('inside, rot 180', () => {
    const pieceContentSize = 10;
    const mx = -4;
    const my = -4;
    const piece = { x: 0, y: 0, rot: 180 };
    const actual = hitTest(mx, my, piece, pieceContentSize);
    const expected = true;

    assert.strictEqual(actual, expected);
  });
  test('inside, rot 270', () => {
    const pieceContentSize = 10;
    const mx = -4;
    const my = -4;
    const piece = { x: 0, y: 0, rot: 270 };
    const actual = hitTest(mx, my, piece, pieceContentSize);
    const expected = true;

    assert.strictEqual(actual, expected);
  });
});
