import assert from 'node:assert/strict';
import test from 'node:test';
import { solarDayHours, lightSeconds, transitDepth } from '../src/lib/learning-math.ts';
import { bodies } from '../src/data/planets.ts';
import { atlasTopics } from '../src/data/cosmos/atlas-topics.ts';
import { galaxyModels } from '../src/lib/galaxy-stages.ts';
import { questions, glossary, readingRoutes } from '../src/data/learning.ts';
import { solarReading, extraSolarDeep } from '../src/data/solar-reading.ts';
import { galaxyReading } from '../src/data/cosmos/galaxy-reading.ts';
import { COSMOS_GROUPS, PLANET_GROUPS } from '../src/components/deep-dive-groups.ts';

test('a solar day combines sidereal rotation and orbital motion with the correct sign', () => {
  const value = id => { const b = bodies.find(b => b.id === id); return solarDayHours(b.dayHours, b.yearDays); };
  assert.ok(Math.abs(value('earth') - 24) < .001);
  assert.ok(Math.abs(value('mars') - 24.66) < .01);
  assert.ok(Math.abs(value('mercury') / 24 - 176) < .2);
  assert.ok(Math.abs(value('venus') / 24 - 116.75) < .1);
  assert.equal(value('sun'), null);
});
test('light time uses distance, with Earth about 499 seconds from the Sun', () => {
  assert.equal(lightSeconds(0), 0);
  assert.ok(Math.abs(lightSeconds(1) - 499.0048) < .001);
  assert.ok(Math.abs(lightSeconds(30) - lightSeconds(1) * 30) < 1e-9);
});
test('transit brightness varies continuously at ingress and egress', () => {
  assert.equal(transitDepth(.2, 2), 0);
  assert.ok(Math.abs(transitDepth(.2, 0) - .04) < 1e-12);
  for (let d = 0; d <= 2; d += .001) {
    const depth = transitDepth(.2, d);
    assert.ok(Number.isFinite(depth) && depth >= 0 && depth <= .04000001);
    assert.equal(depth, transitDepth(.2, -d));
    assert.ok(Math.abs(depth - transitDepth(.2, d+.001)) < .0002);
  }
});
const ids = [...bodies.map(b=>b.id), 'big-bang', 'star-life', ...galaxyModels.map(g=>g.id), ...atlasTopics.map(t=>t.id)];
test('every topic has an explanatory quiz, and routes and glossary links resolve', () => {
  assert.equal(ids.length, new Set(ids).size);
  for (const id of ids) {
    assert.ok(questions[id]?.length, id);
    for (const q of questions[id]) {
      assert.ok(q.answer >= 0 && q.answer < q.choices.length);
      assert.equal(q.choices.length, new Set(q.choices).size);
      assert.ok(q.why.length > 20);
    }
  }
  for (const route of readingRoutes) route.ids.forEach(id=>assert.ok(ids.includes(id), id));
  for (const entry of glossary) assert.ok(ids.includes(entry[3]), entry[0]);
});
test('new chapters have two readings and cannot silently disappear from UI groups', () => {
  const check = (entries, groups) => {
    const categories = groups.flatMap(g=>g.categories);
    assert.equal(entries.length, new Set(entries.map(e=>e.category)).size);
    for (const entry of entries) {
      assert.ok(categories.includes(entry.category), entry.title);
      assert.ok(entry.bodyEasy?.length > 20, entry.title);
      assert.ok(entry.body.length > entry.bodyEasy.length, entry.title);
    }
  };
  for (const body of bodies) assert.ok(solarReading[body.id]?.length > 200, body.id);
  for (const entries of Object.values(extraSolarDeep)) check(entries, PLANET_GROUPS);
  for (const entries of Object.values(galaxyReading)) check(entries, COSMOS_GROUPS);
  for (const topic of atlasTopics) {
    assert.ok(topic.diagram && topic.sources?.length && topic.descriptionEasy);
    check(topic.deepDive, COSMOS_GROUPS);
  }
});
