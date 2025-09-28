/**
 * REALISTIC HABIT IMPACT SYSTEM
 * 
 * This system implements tiered impact levels for habits based on real-world effects.
 * Each habit has varying effectiveness across different statistics:
 * - EXPONENTIAL: Life-changing effects (sleep, exercise, major addictions)
 * - LINEAR: Moderate, proportional effects (diet, social habits)
 * - MINIMAL: Small or targeted effects (reading, journaling)
 */

import { HabitLevels } from '../store/useAtlasStore';
import habitsData from '../data/habits.json';

// TIERED IMPACT SYSTEM - Each habit affects different metrics differently
const HABIT_IMPACT_MATRIX = {
  // SLEEP - Exponential for health/mental, linear for quality of life, minimal for fitness
  sleep_consistency: {
    generalHealth: { type: 'exponential', multiplier: 4.2, curve: 2.0 },
    mentalHealth: { type: 'exponential', multiplier: 4.5, curve: 2.1 },
    qualityOfLife: { type: 'linear', multiplier: 2.8 },
    physicalFitness: { type: 'minimal', multiplier: 0.8 },
    happiness: { type: 'exponential', multiplier: 3.8, curve: 1.8 },
    lifeExpectancy: { type: 'exponential', multiplier: 3.5, curve: 1.9 }
  },

  // EXERCISE - Exponential for fitness/health, linear for mental
  exercise: {
    generalHealth: { type: 'exponential', multiplier: 4.0, curve: 1.9 },
    physicalFitness: { type: 'exponential', multiplier: 5.0, curve: 2.2 },
    mentalHealth: { type: 'linear', multiplier: 3.2 },
    qualityOfLife: { type: 'linear', multiplier: 3.5 },
    happiness: { type: 'linear', multiplier: 3.0 },
    lifeExpectancy: { type: 'exponential', multiplier: 4.2, curve: 2.0 }
  },

  // RECREATIONAL DRUGS - Exponential negative for health, exponential positive for short-term happiness
  drugs: {
    generalHealth: { type: 'exponential', multiplier: -5.0, curve: 2.3 },
    happiness: { type: 'exponential', multiplier: 2.5, curve: 1.5 }, // Short-term boost
    mentalHealth: { type: 'linear', multiplier: -3.8 },
    physicalFitness: { type: 'minimal', multiplier: -0.5 },
    qualityOfLife: { type: 'linear', multiplier: -4.2 },
    lifeExpectancy: { type: 'exponential', multiplier: -4.8, curve: 2.1 }
  },

  // SMOKING - Exponential negative across most metrics
  smoking: {
    generalHealth: { type: 'exponential', multiplier: -4.8, curve: 2.2 },
    physicalFitness: { type: 'exponential', multiplier: -3.5, curve: 1.8 },
    mentalHealth: { type: 'linear', multiplier: -2.2 },
    qualityOfLife: { type: 'linear', multiplier: -3.0 },
    happiness: { type: 'linear', multiplier: -1.8 },
    lifeExpectancy: { type: 'exponential', multiplier: -5.2, curve: 2.3 }
  },

  // ALCOHOL - Exponential for liver/health, moderate for mental
  alcohol: {
    generalHealth: { type: 'exponential', multiplier: -4.2, curve: 2.0 },
    mentalHealth: { type: 'linear', multiplier: -2.8 },
    happiness: { type: 'linear', multiplier: 1.2 }, // Short-term social boost
    physicalFitness: { type: 'linear', multiplier: -2.0 },
    qualityOfLife: { type: 'linear', multiplier: -2.5 },
    lifeExpectancy: { type: 'exponential', multiplier: -3.8, curve: 1.9 }
  },

  // CHRONIC STRESS - Exponential negative across all metrics
  chronic_stress: {
    generalHealth: { type: 'exponential', multiplier: -4.5, curve: 2.1 },
    mentalHealth: { type: 'exponential', multiplier: -5.0, curve: 2.2 },
    physicalFitness: { type: 'linear', multiplier: -2.5 },
    qualityOfLife: { type: 'exponential', multiplier: -4.0, curve: 1.9 },
    happiness: { type: 'exponential', multiplier: -4.8, curve: 2.0 },
    lifeExpectancy: { type: 'exponential', multiplier: -3.5, curve: 1.8 }
  },

  // HEALTHY DIET - Linear to exponential across metrics
  healthy_diet: {
    generalHealth: { type: 'exponential', multiplier: 3.8, curve: 1.7 },
    physicalFitness: { type: 'linear', multiplier: 2.8 },
    mentalHealth: { type: 'linear', multiplier: 2.2 },
    qualityOfLife: { type: 'linear', multiplier: 3.0 },
    happiness: { type: 'linear', multiplier: 2.0 },
    lifeExpectancy: { type: 'linear', multiplier: 3.2 }
  },

  // PROCESSED DIET - Exponential negative for health, linear for others
  processed_diet: {
    generalHealth: { type: 'exponential', multiplier: -3.8, curve: 1.9 },
    physicalFitness: { type: 'linear', multiplier: -2.5 },
    mentalHealth: { type: 'linear', multiplier: -1.8 },
    qualityOfLife: { type: 'linear', multiplier: -2.2 },
    happiness: { type: 'minimal', multiplier: -0.5 },
    lifeExpectancy: { type: 'linear', multiplier: -2.8 }
  },

  // SOCIAL CONNECTION - Exponential for mental health, linear for others
  social_connection: {
    mentalHealth: { type: 'exponential', multiplier: 4.0, curve: 1.9 },
    happiness: { type: 'exponential', multiplier: 4.2, curve: 2.0 },
    generalHealth: { type: 'linear', multiplier: 2.5 },
    qualityOfLife: { type: 'exponential', multiplier: 3.8, curve: 1.8 },
    physicalFitness: { type: 'minimal', multiplier: 0.3 },
    lifeExpectancy: { type: 'linear', multiplier: 3.0 }
  },

  // SOCIAL ISOLATION - Exponential negative for mental health
  social_isolation: {
    mentalHealth: { type: 'exponential', multiplier: -3.8, curve: 1.9 },
    happiness: { type: 'exponential', multiplier: -4.0, curve: 2.0 },
    generalHealth: { type: 'linear', multiplier: -2.0 },
    qualityOfLife: { type: 'exponential', multiplier: -3.5, curve: 1.8 },
    physicalFitness: { type: 'minimal', multiplier: -0.2 },
    lifeExpectancy: { type: 'linear', multiplier: -2.2 }
  },

  // SEDENTARY - Linear to exponential negative for fitness/health
  sedentary: {
    physicalFitness: { type: 'exponential', multiplier: -4.0, curve: 2.0 },
    generalHealth: { type: 'exponential', multiplier: -3.2, curve: 1.8 },
    mentalHealth: { type: 'linear', multiplier: -2.0 },
    qualityOfLife: { type: 'linear', multiplier: -2.5 },
    happiness: { type: 'linear', multiplier: -1.8 },
    lifeExpectancy: { type: 'linear', multiplier: -2.8 }
  },

  // MEDITATION - Exponential for mental health, linear for others
  meditation: {
    mentalHealth: { type: 'exponential', multiplier: 3.5, curve: 1.8 },
    happiness: { type: 'linear', multiplier: 3.0 },
    generalHealth: { type: 'linear', multiplier: 2.0 },
    qualityOfLife: { type: 'linear', multiplier: 2.8 },
    physicalFitness: { type: 'minimal', multiplier: 0.5 },
    lifeExpectancy: { type: 'linear', multiplier: 1.8 }
  },

  // READING - Moderate benefits to mental well-being, minimal effect on health
  reading: {
    mentalHealth: { type: 'linear', multiplier: 2.2 },
    happiness: { type: 'linear', multiplier: 1.8 },
    generalHealth: { type: 'minimal', multiplier: 0.2 }, // Minimal, not negative
    qualityOfLife: { type: 'linear', multiplier: 2.0 },
    physicalFitness: { type: 'minimal', multiplier: 0.0 },
    lifeExpectancy: { type: 'minimal', multiplier: 0.8 }
  },

  // JOURNALING - Targeted mental health benefits
  journaling: {
    mentalHealth: { type: 'linear', multiplier: 1.8 },
    happiness: { type: 'linear', multiplier: 1.5 },
    generalHealth: { type: 'minimal', multiplier: 0.1 },
    qualityOfLife: { type: 'linear', multiplier: 1.6 },
    physicalFitness: { type: 'minimal', multiplier: 0.0 },
    lifeExpectancy: { type: 'minimal', multiplier: 0.3 }
  },

  // HYDRATION - Linear benefits across most metrics
  hydration: {
    generalHealth: { type: 'linear', multiplier: 2.5 },
    physicalFitness: { type: 'linear', multiplier: 2.0 },
    mentalHealth: { type: 'linear', multiplier: 1.5 },
    qualityOfLife: { type: 'linear', multiplier: 1.8 },
    happiness: { type: 'minimal', multiplier: 0.8 },
    lifeExpectancy: { type: 'linear', multiplier: 1.2 }
  },

  // GAMING - Moderate negative effects, some positive for happiness
  gaming: {
    mentalHealth: { type: 'linear', multiplier: -1.8 },
    physicalFitness: { type: 'linear', multiplier: -1.5 },
    generalHealth: { type: 'linear', multiplier: -1.2 },
    happiness: { type: 'linear', multiplier: 1.0 }, // Short-term entertainment
    qualityOfLife: { type: 'linear', multiplier: -1.5 },
    lifeExpectancy: { type: 'minimal', multiplier: -0.5 }
  },

  // PORNOGRAPHY - Targeted negative effects on mental health
  pornography: {
    mentalHealth: { type: 'linear', multiplier: -2.5 },
    happiness: { type: 'linear', multiplier: -1.8 },
    generalHealth: { type: 'minimal', multiplier: -0.3 },
    qualityOfLife: { type: 'linear', multiplier: -2.0 },
    physicalFitness: { type: 'minimal', multiplier: 0.0 },
    lifeExpectancy: { type: 'minimal', multiplier: -0.2 }
  }
};

// BASELINE VALUES based on population health statistics
const BASELINE_VALUES = {
  generalHealth: 50,
  mentalHealth: 50,
  physicalFitness: 50,
  qualityOfLife: 50,
  happiness: 50,
  lifeExpectancy: 78 // Average life expectancy
};

interface RealisticHealthResult {
  overallHealth: number;
  organHealth: Record<string, number>;
  exponentialFactors: {
    positive: Array<{ habit: string, impact: number, explanation: string }>;
    negative: Array<{ habit: string, impact: number, explanation: string }>;
  };
  riskAssessment: {
    physicalHealth: number;
    mentalHealth: number;
    lifeExpectancy: number;
    diseaseRisk: number;
  };
  prioritizedRecommendations: Array<{
    priority: 'critical' | 'high' | 'moderate';
    action: string;
    rationale: string;
    expectedImpact: string;
  }>;
}

/**
 * Calculate realistic health impact using tiered effect system
 */
export const calculateExponentialHealth = (habits: HabitLevels): RealisticHealthResult => {
  const results = {
    generalHealth: BASELINE_VALUES.generalHealth,
    mentalHealth: BASELINE_VALUES.mentalHealth,
    physicalFitness: BASELINE_VALUES.physicalFitness,
    qualityOfLife: BASELINE_VALUES.qualityOfLife,
    happiness: BASELINE_VALUES.happiness,
    lifeExpectancy: BASELINE_VALUES.lifeExpectancy
  };

  const exponentialFactors = { positive: [], negative: [] };
  const organHealth: Record<string, number> = {};

  // Process each habit's impact on all metrics
  Object.entries(habits).forEach(([habitId, habitData]) => {
    const level = habitData?.level || 0;
    if (level === 0) return;

    const habitImpacts = HABIT_IMPACT_MATRIX[habitId];
    if (!habitImpacts) return;

    const habit = habitsData.habits.find(h => h.id === habitId);
    if (!habit) return;

    // Apply impacts to each metric
    Object.entries(habitImpacts).forEach(([metric, impact]) => {
      let effectValue = 0;

      switch (impact.type) {
        case 'exponential':
          // Exponential scaling with custom curve
          effectValue = impact.multiplier * Math.pow(level, impact.curve || 2.0);
          break;
        case 'linear':
          // Linear scaling
          effectValue = impact.multiplier * level;
          break;
        case 'minimal':
          // Minimal effect with diminishing returns
          effectValue = impact.multiplier * Math.sqrt(level);
          break;
      }

      if (results[metric] !== undefined) {
        results[metric] += effectValue;
      }
    });

    // Track significant exponential factors
    const hasExponentialEffect = Object.values(habitImpacts).some(impact => 
      impact.type === 'exponential' && Math.abs(impact.multiplier) > 3.0
    );

    if (hasExponentialEffect) {
      const totalImpact = Object.values(habitImpacts).reduce((sum, impact) => {
        if (impact.type === 'exponential') {
          return sum + Math.abs(impact.multiplier * Math.pow(level, impact.curve || 2.0));
        }
        return sum;
      }, 0);

      const factorData = {
        habit: habit.name,
        impact: totalImpact,
        explanation: generateRealisticExplanation(habitId, level, habitImpacts)
      };

      if (habit.kind === 'good') {
        exponentialFactors.positive.push(factorData);
      } else {
        exponentialFactors.negative.push(factorData);
      }
    }
  });

  // Ensure realistic bounds
  Object.keys(results).forEach(key => {
    if (key === 'lifeExpectancy') {
      results[key] = Math.max(65, Math.min(95, results[key]));
    } else {
      results[key] = Math.max(10, Math.min(100, results[key]));
    }
  });

  // Calculate organ health using simplified approach
  const organIds = ['lungs', 'heart', 'brain', 'liver', 'kidneys', 'gut', 'skin'];
  organIds.forEach(organId => {
    // Base organ health on general health with some variation
    let baseHealth = results.generalHealth;
    
    // Apply organ-specific modifiers based on relevant habits
    if (organId === 'lungs' && habits.smoking?.level > 0) {
      baseHealth -= habits.smoking.level * 15;
    }
    if (organId === 'liver' && habits.alcohol?.level > 0) {
      baseHealth -= habits.alcohol.level * 18;
    }
    if (organId === 'brain' && habits.drugs?.level > 0) {
      baseHealth -= habits.drugs.level * 20;
    }
    if (organId === 'heart' && habits.exercise?.level > 0) {
      baseHealth += habits.exercise.level * 8;
    }

    organHealth[organId] = Math.max(15, Math.min(100, baseHealth));
  });

  // Calculate risk assessment
  const riskAssessment = {
    physicalHealth: results.physicalFitness,
    mentalHealth: results.mentalHealth,
    lifeExpectancy: results.lifeExpectancy,
    diseaseRisk: Math.max(5, Math.min(85, 100 - results.generalHealth))
  };

  // Generate prioritized recommendations
  const prioritizedRecommendations = generateRealisticRecommendations(habits, results);

  return {
    overallHealth: results.generalHealth,
    organHealth,
    exponentialFactors,
    riskAssessment,
    prioritizedRecommendations
  };
};

/**
 * Generate realistic explanations for habit impacts
 */
const generateRealisticExplanation = (habitId: string, level: number, impacts: any): string => {
  const explanations = {
    sleep_consistency: `Quality sleep at level ${level} has exponential effects on recovery, immune function, and cognitive performance. Sleep is the foundation of health.`,
    exercise: `Physical activity at level ${level} provides exponential cardiovascular benefits and dramatically improves multiple health markers.`,
    drugs: `Recreational drug use at level ${level} causes exponential damage to brain chemistry and organ function, while providing short-term mood elevation.`,
    smoking: `Smoking at level ${level} creates exponential cardiovascular and respiratory damage that compounds over time.`,
    alcohol: `Alcohol consumption at level ${level} has exponential effects on liver function and moderate effects on mental health.`,
    chronic_stress: `Chronic stress at level ${level} elevates cortisol exponentially, affecting all body systems and mental well-being.`,
    social_connection: `Social connection at level ${level} provides exponential mental health benefits and significantly improves quality of life.`,
    reading: `Reading at level ${level} provides moderate cognitive benefits and mental stimulation, with minimal direct health effects.`,
    meditation: `Meditation at level ${level} has exponential benefits for stress reduction and mental clarity.`,
    healthy_diet: `A healthy diet at level ${level} provides broad health benefits across multiple systems.`
  };

  return explanations[habitId] || `This habit at level ${level} affects your health in multiple ways.`;
};

/**
 * Generate realistic, prioritized recommendations
 */
const generateRealisticRecommendations = (habits: HabitLevels, results: any) => {
  const recommendations = [];

  // Critical: Address life-threatening exponential habits
  const criticalHabits = ['chronic_stress', 'drugs', 'smoking'];
  criticalHabits.forEach(habitId => {
    const level = habits[habitId]?.level || 0;
    if (level > 1) {
      const habit = habitsData.habits.find(h => h.id === habitId);
      recommendations.push({
        priority: 'critical' as const,
        action: `Immediately reduce ${habit?.name.toLowerCase()}`,
        rationale: `This habit has exponential negative effects that override positive health factors.`,
        expectedImpact: `Could improve overall health by 20-35%.`
      });
    }
  });

  // High: Implement exponential beneficial habits
  if ((habits.sleep_consistency?.level || 0) < 2) {
    recommendations.push({
      priority: 'high' as const,
      action: `Prioritize consistent, quality sleep`,
      rationale: `Sleep has the highest exponential impact on health, recovery, and cognitive function.`,
      expectedImpact: `Could improve overall health by 25-40%.`
    });
  }

  if ((habits.exercise?.level || 0) < 2) {
    recommendations.push({
      priority: 'high' as const,
      action: `Increase regular physical exercise`,
      rationale: `Exercise provides exponential benefits for cardiovascular health and overall fitness.`,
      expectedImpact: `Could improve physical fitness by 30-50%.`
    });
  }

  // Moderate: Optimize other beneficial habits
  if ((habits.social_connection?.level || 0) < 2) {
    recommendations.push({
      priority: 'moderate' as const,
      action: `Strengthen social connections`,
      rationale: `Social bonds provide exponential mental health benefits and improve quality of life.`,
      expectedImpact: `Could improve mental health by 15-25%.`
    });
  }

  if ((habits.healthy_diet?.level || 0) < 2) {
    recommendations.push({
      priority: 'moderate' as const,
      action: `Improve dietary habits`,
      rationale: `A healthy diet provides broad benefits across multiple health systems.`,
      expectedImpact: `Could improve general health by 10-20%.`
    });
  }

  return recommendations.slice(0, 5);
};