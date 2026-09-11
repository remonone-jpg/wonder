import assert from 'node:assert/strict';
import test from 'node:test';
import { cosmosStages, progressOf, stageAt } from '../src/lib/cosmos-stages.ts';

test('the beginning-of-the-universe timeline has eight complete scenes', () => {
  assert.equal(cosmosStages.length, 8);
  assert.deepEqual(cosmosStages.map(stage => stage.id), [
    'big-bang', 'three-minutes', 'recombination', 'dark-ages',
    'first-stars', 'first-galaxies', 'sun-earth', 'now',
  ]);
  for (const stage of cosmosStages) {
    assert.ok(stage.name && stage.ageLabel && stage.note);
    assert.ok(stage.easy.length > 25);
    assert.ok(stage.detail.length > stage.easy.length);
    assert.ok(stage.observe.length > 10);
  }
});

test('stage interpolation always has two endpoints, including the last stop', () => {
  for (let i = -10; i <= 110; i += 1) {
    const { index, fraction, nearest } = stageAt(i / 100);
    assert.ok(cosmosStages[index] && cosmosStages[index + 1] && nearest);
    assert.ok(fraction >= 0 && fraction <= 1);
  }
  cosmosStages.forEach((stage, index) => assert.equal(stageAt(progressOf(index)).nearest, stage));
});

test('the recombination scene carries the transparent-universe emphasis', () => {
  const recombination = cosmosStages.find(stage => stage.id === 'recombination');
  assert.ok(recombination);
  assert.ok(recombination.photonRelease > 0.9);
  assert.ok(recombination.fog < cosmosStages[1].fog);
  assert.match(recombination.detail, /우주배경복사/);
});
