import assert from 'node:assert/strict';
import test from 'node:test';
import { galaxyById, galaxyModels } from '../src/lib/galaxy-stages.ts';
import { milkyWay } from '../src/data/cosmos/milky-way.ts';
import { andromeda as andromedaEntry } from '../src/data/cosmos/andromeda.ts';
import { largeMagellanicCloud } from '../src/data/cosmos/large-magellanic-cloud.ts';
import { m87 } from '../src/data/cosmos/m87.ts';

test('the galaxy gallery contains four distinct, fully described models', () => {
  assert.deepEqual(galaxyModels.map(model => model.id), [
    'milky-way', 'andromeda', 'large-magellanic-cloud', 'm87',
  ]);
  for (const model of galaxyModels) {
    assert.equal(galaxyById[model.id], model);
    assert.ok(model.name && model.type && model.distance);
    assert.ok(model.easy.length > 20);
    assert.ok(model.detail.length > model.easy.length);
    assert.equal(model.views.length, 4);
    assert.deepEqual(model.views.map(view => view.id), ['wide', 'structure', 'core', 'light']);
    for (const view of model.views) {
      assert.ok(view.name && view.note && view.easy && view.detail && view.observe);
    }
  }
});

test('galaxy entries are wired to the galaxy scene without changing CosmosId', () => {
  const entries = [milkyWay, andromedaEntry, largeMagellanicCloud, m87];
  assert.equal(entries.length, 4);
  for (const entry of entries) {
    assert.equal(entry.scene, 'galaxy');
    assert.ok(entry.galaxyId);
    assert.equal(galaxyById[entry.galaxyId].name, entry.name);
  }
});

test('the Andromeda copy keeps the future encounter uncertain', () => {
  const andromeda = galaxyById.andromeda;
  assert.match(andromeda.detail, /확정적이지 않|가능성이 있는 시나리오/);
  assert.doesNotMatch(andromeda.detail, /반드시 충돌|확정된 충돌/);
});
