import test from 'node:test';
import assert from 'node:assert/strict';

import { generateWeeklyPlan, buildExerciseSequence } from '../src/lib/plan.js';
import { exercises } from '../src/data/exercises.js';

test('generateWeeklyPlan creates a weekly routine for iniciante', () => {
  const plan = generateWeeklyPlan('iniciante');

  assert.equal(plan.length, 5);
  assert.equal(plan[0].day, 'Seg');
  assert.ok(plan.every((item) => item.minutes >= 4));
});

test('buildExerciseSequence returns only the relevant exercises for each level', () => {
  const beginner = buildExerciseSequence(exercises, 'iniciante');
  const intermediate = buildExerciseSequence(exercises, 'intermediario');
  const advanced = buildExerciseSequence(exercises, 'avancado');

  assert.deepEqual(
    beginner.map((item) => item.title),
    [
      'Respiração e projeção',
      'Articulação limpa',
      'Trava língua de consoantes',
      'Tigres tristes'
    ]
  );

  assert.ok(intermediate.includes(intermediate.find((item) => item.title === 'Trava língua de velocidade')));
  assert.ok(advanced.includes(advanced.find((item) => item.title === 'Trava língua de expressão')));
});
