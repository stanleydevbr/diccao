export const levelConfig = {
  iniciante: {
    label: 'Iniciante',
    focus: ['respiração', 'articulação'],
    sessions: 4
  },
  intermediario: {
    label: 'Intermediário',
    focus: ['ritmo', 'entonação'],
    sessions: 5
  },
  avancado: {
    label: 'Avançado',
    focus: ['resistência', 'expressão'],
    sessions: 5
  }
};

export function buildExerciseSequence(exercises, level = 'iniciante') {
  const levelOrder = { iniciante: 0, intermediario: 1, avancado: 2 };

  const focused = exercises.filter((exercise) => {
    if (level === 'iniciante') {
      return exercise.level === 'iniciante';
    }

    if (level === 'intermediario') {
      return exercise.level === 'iniciante' || exercise.level === 'intermediario';
    }

    return exercise.level === 'intermediario' || exercise.level === 'avancado';
  });

  focused.sort((a, b) => {
    const aPriority = a.level === level ? 0 : 1;
    const bPriority = b.level === level ? 0 : 1;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return levelOrder[a.level] - levelOrder[b.level];
  });

  return focused.slice(0, levelConfig[level]?.sessions || 4);
}

export function generateWeeklyPlan(level = 'iniciante') {
  const config = levelConfig[level] || levelConfig.iniciante;
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

  return days.map((day, index) => {
    const focus = config.focus[index % config.focus.length];
    const minutes = 4 + (index % 2) + (level === 'avancado' ? 1 : 0);

    return {
      day,
      focus,
      minutes,
      goal: `Treinar ${focus} em ${minutes} minutos.`
    };
  });
}
