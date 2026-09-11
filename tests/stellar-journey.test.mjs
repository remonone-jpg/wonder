import assert from 'node:assert/strict';
import test from 'node:test';
import { starStages, stageAt, progressOf, FORK_AT } from '../src/lib/star-stages.ts';
import { starGuide } from '../src/data/star-guide.ts';
import { COSMOS_GROUPS, COSMOS_META, PLANET_GROUPS, PLANET_META } from '../src/components/deep-dive-groups.ts';

test('massive-star outcomes are alternatives, never sequential stages', () => {
  const neutron = starStages('heavy', 'neutron');
  const blackhole = starStages('heavy', 'blackhole');
  assert.deepEqual(neutron.slice(0, -1), blackhole.slice(0, -1));
  assert.equal(neutron.at(-2).name, '초신성');
  assert.equal(neutron.at(-1).name, '중성자별');
  assert.equal(blackhole.at(-1).name, '블랙홀');
  assert.equal(neutron.some(s => s.name === '블랙홀'), false);
  assert.equal(blackhole.some(s => s.name === '중성자별'), false);
});

test('choosing mass at the fork preserves the current physical stage', () => {
  const trunk = starStages(null);
  const current = stageAt(1, trunk).nearest;
  for (const path of ['light', 'heavy']) {
    const branch = starStages(path);
    assert.equal(stageAt(progressOf(FORK_AT, branch), branch).nearest.name, current.name);
  }
});

test('sliders can traverse both routes without a missing interpolation endpoint', () => {
  for (const path of [null, 'light', 'heavy']) {
    for (const remnant of ['neutron', 'blackhole']) {
      const stages = starStages(path, remnant);
      for (let i = -10; i <= 110; i++) {
        const { index, fraction, nearest } = stageAt(i / 100, stages);
        assert.ok(stages[index] && stages[index + 1] && nearest);
        assert.ok(fraction >= 0 && fraction <= 1);
      }
      stages.forEach((stage, i) => assert.equal(stageAt(progressOf(i, stages), stages).nearest, stage));
    }
  }
});

test('all ten distinct scenes include both readings and observation guidance', () => {
  const all = [...starStages('light'), ...starStages('heavy'), ...starStages('heavy', 'blackhole')];
  const names = new Set(all.map(s => s.name));
  assert.equal(names.size, 10);
  for (const name of names) {
    const guide = starGuide[name];
    assert.ok(guide?.easy && guide.detail && guide.observe && guide.question, name);
  }
});

test('every category is visible in exactly one UI group in its own layer', () => {
  for (const [groups, meta] of [[PLANET_GROUPS, PLANET_META], [COSMOS_GROUPS, COSMOS_META]]) {
    const visible = groups.flatMap(group => group.categories);
    assert.equal(visible.length, new Set(visible).size);
    assert.deepEqual([...visible].sort(), Object.keys(meta).sort());
  }
});
