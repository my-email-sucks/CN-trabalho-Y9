/**
 * REALISTIC TARGETED HEALTH ASSESSMENT SYSTEM
 * 
 * This system implements realistic, targeted effects where each habit has specific areas of impact.
 * Some habits are foundational (sleep, exercise, diet) while others are targeted (reading, meditation).
 * 
 * Effect Scale: 0-20 points (with recreational drugs as exception up to 30)
 * Targeting: Each habit affects 1-2 primary areas strongly, others minimally
 */

import { HabitLevels } from '../store/useAtlasStore';
import habitsData from '../data/habits.json';

// TARGETED HABIT EFFECTS - Each habit has specific primary and secondary impacts
const HABIT_EFFECTS = {
  // === FOUNDATIONAL HABITS (affect multiple systems) ===
  
  sleep_consistency: {
    // PRIMARY: Mental health, general health (sleep is foundational)
    // SECONDARY: Quality of life, recovery
    // MINIMAL: Physical fitness, happiness
    general_health: { base: 18, curve: 1.6 },      // Exponential - sleep affects everything
    mental_health: { base: 20, curve: 1.7 },       // Exponential - critical for brain function
    quality_of_life: { base: 12, curve: 1.3 },     // Linear - good sleep = better life
    physical_fitness: { base: 4, curve: 1.1 },     // Minimal - doesn't make you fit
    happiness: { base: 6, curve: 1.2 },            // Minimal - helps mood slightly
    life_expectancy: { base: 8, curve: 1.4 },      // Moderate - longevity factor
    disease_risk: { base: -15, curve: 1.5 },       // Strong prevention
    overall_wellness: { base: 14, curve: 1.5 }     // Strong overall impact
  },

  exercise: {
    // PRIMARY: Physical fitness, physical health
    // SECONDARY: Mental health, happiness (endorphins)
    // MINIMAL: General health, quality of life
    physical_fitness: { base: 20, curve: 1.8 },    // Exponential - primary purpose
    mental_health: { base: 14, curve: 1.4 },       // Strong - endorphins, confidence
    happiness: { base: 12, curve: 1.3 },           // Moderate - feel-good factor
    general_health: { base: 8, curve: 1.2 },       // Minimal - fitness ≠ health
    quality_of_life: { base: 6, curve: 1.2 },      // Minimal - indirect benefit
    life_expectancy: { base: 10, curve: 1.4 },     // Moderate - cardiovascular benefits
    disease_risk: { base: -12, curve: 1.4 },       // Moderate prevention
    overall_wellness: { base: 10, curve: 1.3 }     // Moderate overall
  },

  healthy_diet: {
    // PRIMARY: General health, disease prevention
    // SECONDARY: Physical fitness, life expectancy
    // MINIMAL: Mental health, happiness
    general_health: { base: 16, curve: 1.5 },      // Strong - nutrition is key
    physical_fitness: { base: 10, curve: 1.3 },    // Moderate - supports fitness
    life_expectancy: { base: 12, curve: 1.4 },     // Strong - longevity factor
    disease_risk: { base: -18, curve: 1.6 },       // Exponential prevention
    mental_health: { base: 6, curve: 1.2 },        // Minimal - some brain benefits
    happiness: { base: 4, curve: 1.1 },            // Minimal - indirect
    quality_of_life: { base: 8, curve: 1.2 },      // Minimal - feeling better
    overall_wellness: { base: 12, curve: 1.4 }     // Strong overall
  },

  hydration: {
    // PRIMARY: General health, physical performance
    // SECONDARY: Mental clarity
    // MINIMAL: Everything else
    general_health: { base: 8, curve: 1.3 },       // Moderate - basic need
    physical_fitness: { base: 6, curve: 1.2 },     // Minimal - supports performance
    mental_health: { base: 4, curve: 1.1 },        // Minimal - brain function
    happiness: { base: 2, curve: 1.0 },            // None - doesn't affect mood
    quality_of_life: { base: 4, curve: 1.1 },      // Minimal - feeling better
    life_expectancy: { base: 3, curve: 1.1 },      // Minimal - basic health
    disease_risk: { base: -5, curve: 1.2 },        // Minimal prevention
    overall_wellness: { base: 5, curve: 1.2 }      // Minimal overall
  },

  // === TARGETED BENEFICIAL HABITS ===

  meditation: {
    // PRIMARY: Mental health, stress reduction
    // SECONDARY: Happiness, quality of life
    // MINIMAL: Physical aspects
    mental_health: { base: 16, curve: 1.5 },       // Strong - primary purpose
    happiness: { base: 12, curve: 1.4 },           // Strong - peace of mind
    quality_of_life: { base: 10, curve: 1.3 },     // Moderate - life satisfaction
    general_health: { base: 4, curve: 1.1 },       // Minimal - stress reduction
    physical_fitness: { base: 0, curve: 1.0 },     // None - doesn't make you fit
    life_expectancy: { base: 3, curve: 1.1 },      // Minimal - stress reduction
    disease_risk: { base: -6, curve: 1.2 },        // Minimal - stress-related
    overall_wellness: { base: 8, curve: 1.3 }      // Moderate overall
  },

  social_connection: {
    // PRIMARY: Happiness, mental health
    // SECONDARY: Quality of life, life expectancy
    // MINIMAL: Physical aspects
    happiness: { base: 18, curve: 1.6 },           // Exponential - humans are social
    mental_health: { base: 14, curve: 1.4 },       // Strong - prevents depression
    quality_of_life: { base: 12, curve: 1.3 },     // Strong - life satisfaction
    life_expectancy: { base: 8, curve: 1.3 },      // Moderate - loneliness kills
    general_health: { base: 4, curve: 1.1 },       // Minimal - stress reduction
    physical_fitness: { base: 0, curve: 1.0 },     // None
    disease_risk: { base: -5, curve: 1.2 },        // Minimal - stress-related
    overall_wellness: { base: 10, curve: 1.3 }     // Moderate overall
  },

  reading: {
    // PRIMARY: Mental stimulation
    // SECONDARY: Happiness (if you enjoy it)
    // MINIMAL: Everything else
    mental_health: { base: 8, curve: 1.2 },        // Moderate - cognitive stimulation
    happiness: { base: 6, curve: 1.2 },            // Minimal - if you enjoy it
    quality_of_life: { base: 4, curve: 1.1 },      // Minimal - personal growth
    general_health: { base: 0, curve: 1.0 },       // None - reading doesn't affect health
    physical_fitness: { base: 0, curve: 1.0 },     // None
    life_expectancy: { base: 2, curve: 1.0 },      // None - maybe cognitive reserve
    disease_risk: { base: 0, curve: 1.0 },         // None
    overall_wellness: { base: 3, curve: 1.1 }      // Minimal overall
  },

  journaling: {
    // PRIMARY: Mental health (emotional processing)
    // SECONDARY: Happiness
    // MINIMAL: Everything else
    mental_health: { base: 10, curve: 1.3 },       // Moderate - emotional processing
    happiness: { base: 6, curve: 1.2 },            // Minimal - self-reflection
    quality_of_life: { base: 4, curve: 1.1 },      // Minimal - self-awareness
    general_health: { base: 0, curve: 1.0 },       // None
    physical_fitness: { base: 0, curve: 1.0 },     // None
    life_expectancy: { base: 0, curve: 1.0 },      // None
    disease_risk: { base: -2, curve: 1.0 },        // None - maybe stress
    overall_wellness: { base: 4, curve: 1.1 }      // Minimal overall
  },

  // === HARMFUL HABITS ===

  drugs: {
    // PRIMARY: Massive health damage, some temporary happiness
    // SECONDARY: Mental health damage
    // AFFECTS: Everything negatively except short-term happiness
    general_health: { base: -30, curve: 1.8 },     // EXCEPTION - maximum damage
    mental_health: { base: -20, curve: 1.6 },      // Strong damage - addiction, etc.
    physical_fitness: { base: -8, curve: 1.3 },    // Moderate - depends on drug
    happiness: { base: 8, curve: 1.4 },            // Temporary boost (ironic)
    quality_of_life: { base: -15, curve: 1.5 },    // Strong negative - life destruction
    life_expectancy: { base: -12, curve: 1.5 },    // Strong negative - overdose risk
    disease_risk: { base: 25, curve: 1.7 },        // Exponential increase
    overall_wellness: { base: -18, curve: 1.6 }    // Strong negative overall
  },

  smoking: {
    // PRIMARY: General health, life expectancy
    // SECONDARY: Physical fitness
    // MINIMAL: Mental aspects (might reduce stress temporarily)
    general_health: { base: -18, curve: 1.6 },     // Strong damage - cancer, etc.
    physical_fitness: { base: -12, curve: 1.4 },   // Strong - lung capacity
    life_expectancy: { base: -15, curve: 1.5 },    // Strong - well documented
    disease_risk: { base: 20, curve: 1.6 },        // Strong increase
    mental_health: { base: -4, curve: 1.2 },       // Minimal - some stress relief
    happiness: { base: 2, curve: 1.1 },            // Minimal - temporary relief
    quality_of_life: { base: -8, curve: 1.3 },     // Moderate - health issues
    overall_wellness: { base: -12, curve: 1.4 }    // Strong negative overall
  },

  alcohol: {
    // PRIMARY: General health, mental health
    // SECONDARY: Happiness (temporary), quality of life
    // AFFECTS: Most things negatively
    general_health: { base: -15, curve: 1.5 },     // Strong - liver, brain damage
    mental_health: { base: -12, curve: 1.4 },      // Strong - depression, anxiety
    happiness: { base: 4, curve: 1.2 },            // Temporary boost
    quality_of_life: { base: -10, curve: 1.3 },    // Moderate negative
    physical_fitness: { base: -6, curve: 1.2 },    // Moderate - affects performance
    life_expectancy: { base: -8, curve: 1.3 },     // Moderate negative
    disease_risk: { base: 12, curve: 1.4 },        // Moderate increase
    overall_wellness: { base: -10, curve: 1.3 }    // Moderate negative overall
  },

  chronic_stress: {
    // PRIMARY: Mental health, general health
    // SECONDARY: Everything else (stress affects all systems)
    // AFFECTS: All systems negatively
    mental_health: { base: -20, curve: 1.7 },      // Exponential damage - primary target
    general_health: { base: -16, curve: 1.5 },     // Strong - cortisol damage
    happiness: { base: -18, curve: 1.6 },          // Strong - stress = unhappiness
    quality_of_life: { base: -14, curve: 1.5 },    // Strong - affects everything
    physical_fitness: { base: -8, curve: 1.3 },    // Moderate - fatigue, etc.
    life_expectancy: { base: -10, curve: 1.4 },    // Moderate - stress kills
    disease_risk: { base: 15, curve: 1.5 },        // Strong increase
    overall_wellness: { base: -15, curve: 1.5 }    // Strong negative overall
  },

  processed_diet: {
    // PRIMARY: General health, disease risk
    // SECONDARY: Physical fitness, life expectancy
    // MINIMAL: Mental aspects
    general_health: { base: -12, curve: 1.4 },     // Strong - inflammation, etc.
    disease_risk: { base: 15, curve: 1.5 },        // Strong increase - diabetes, etc.
    physical_fitness: { base: -8, curve: 1.3 },    // Moderate - weight gain
    life_expectancy: { base: -6, curve: 1.3 },     // Moderate negative
    mental_health: { base: -4, curve: 1.2 },       // Minimal - some brain effects
    happiness: { base: 2, curve: 1.1 },            // Minimal - comfort food
    quality_of_life: { base: -6, curve: 1.2 },     // Minimal - feeling sluggish
    overall_wellness: { base: -8, curve: 1.3 }     // Moderate negative overall
  },

  sedentary: {
    // PRIMARY: Physical fitness
    // SECONDARY: General health, mental health
    // MINIMAL: Other aspects
    physical_fitness: { base: -16, curve: 1.5 },   // Strong - primary effect
    general_health: { base: -8, curve: 1.3 },      // Moderate - cardiovascular
    mental_health: { base: -6, curve: 1.2 },       // Minimal - mood effects
    happiness: { base: -4, curve: 1.2 },           // Minimal - energy levels
    quality_of_life: { base: -6, curve: 1.2 },     // Minimal - feeling sluggish
    life_expectancy: { base: -4, curve: 1.2 },     // Minimal - long-term effects
    disease_risk: { base: 8, curve: 1.3 },         // Moderate increase
    overall_wellness: { base: -6, curve: 1.2 }     // Minimal overall
  },

  social_isolation: {
    // PRIMARY: Happiness, mental health
    // SECONDARY: Quality of life
    // MINIMAL: Physical aspects
    happiness: { base: -16, curve: 1.5 },          // Strong - humans need connection
    mental_health: { base: -14, curve: 1.4 },      // Strong - depression risk
    quality_of_life: { base: -10, curve: 1.3 },    // Moderate - life satisfaction
    life_expectancy: { base: -6, curve: 1.2 },     // Minimal - loneliness effects
    general_health: { base: -4, curve: 1.2 },      // Minimal - stress effects
    physical_fitness: { base: 0, curve: 1.0 },     // None
    disease_risk: { base: 4, curve: 1.2 },         // Minimal increase
    overall_wellness: { base: -8, curve: 1.3 }     // Moderate negative overall
  },

  gaming: {
    // PRIMARY: Physical fitness (sedentary), mental health (if excessive)
    // SECONDARY: Social isolation effects
    // MINIMAL: Most other aspects
    physical_fitness: { base: -8, curve: 1.3 },    // Moderate - sedentary activity
    mental_health: { base: -6, curve: 1.2 },       // Minimal - if excessive
    happiness: { base: 4, curve: 1.2 },            // Minimal - entertainment value
    quality_of_life: { base: -4, curve: 1.2 },     // Minimal - time displacement
    general_health: { base: -2, curve: 1.1 },      // Minimal - eye strain, etc.
    life_expectancy: { base: 0, curve: 1.0 },      // None
    disease_risk: { base: 2, curve: 1.1 },         // Minimal increase
    overall_wellness: { base: -3, curve: 1.1 }     // Minimal negative overall
  },

  pornography: {
    // PRIMARY: Mental health, happiness (relationship effects)
    // SECONDARY: Quality of life
    // MINIMAL: Physical aspects
    mental_health: { base: -10, curve: 1.3 },      // Moderate - addiction potential
    happiness: { base: -8, curve: 1.3 },           // Moderate - relationship effects
    quality_of_life: { base: -6, curve: 1.2 },     // Minimal - personal effects
    general_health: { base: 0, curve: 1.0 },       // None
    physical_fitness: { base: 0, curve: 1.0 },     // None
    life_expectancy: { base: 0, curve: 1.0 },      // None
    disease_risk: { base: 0, curve: 1.0 },         // None
    overall_wellness: { base: -4, curve: 1.2 }     // Minimal negative overall
  }
};

// BASELINE HEALTH VALUES - realistic starting points
const BASELINE_HEALTH = {
  general_health: 50,
  mental_health: 50,
  happiness: 50,
  quality_of_life: 50,
  physical_fitness: 50,
  life_expectancy: 78, // Average life expectancy
  disease_risk: 25,    // Baseline risk percentage
  overall_wellness: 50
};

interface TargetedHealthResult {
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
 * Calculate targeted health impact with realistic, specific effects
 */
export const calculateExponentialHealth = (habits: HabitLevels): TargetedHealthResult => {
  const healthMetrics = { ...BASELINE_HEALTH };
  const exponentialFactors = { positive: [], negative: [] };
  
  // Calculate effects for each habit
  Object.entries(habits).forEach(([habitId, habitData]) => {
    const level = habitData?.level || 0;
    if (level === 0) return;
    
    const habitEffects = HABIT_EFFECTS[habitId];
    if (!habitEffects) return;
    
    const habit = habitsData.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Apply effects to each metric
    Object.entries(habitEffects).forEach(([metric, effect]) => {
      if (healthMetrics[metric] !== undefined) {
        // Calculate impact using curve scaling
        const scaledLevel = Math.pow(level, effect.curve);
        const impact = effect.base * (scaledLevel / Math.pow(3, effect.curve));
        
        healthMetrics[metric] += impact;
        
        // Track significant effects for exponential factors
        if (Math.abs(impact) >= 5) {
          const factorData = {
            habit: habit.name,
            impact: Math.abs(impact),
            explanation: getTargetedExplanation(habitId, metric, level, impact)
          };
          
          if (impact > 0) {
            exponentialFactors.positive.push(factorData);
          } else {
            exponentialFactors.negative.push(factorData);
          }
        }
      }
    });
  });
  
  // Ensure realistic bounds
  healthMetrics.general_health = Math.max(10, Math.min(100, healthMetrics.general_health));
  healthMetrics.mental_health = Math.max(10, Math.min(100, healthMetrics.mental_health));
  healthMetrics.happiness = Math.max(10, Math.min(100, healthMetrics.happiness));
  healthMetrics.quality_of_life = Math.max(10, Math.min(100, healthMetrics.quality_of_life));
  healthMetrics.physical_fitness = Math.max(10, Math.min(100, healthMetrics.physical_fitness));
  healthMetrics.life_expectancy = Math.max(65, Math.min(95, healthMetrics.life_expectancy));
  healthMetrics.disease_risk = Math.max(5, Math.min(85, healthMetrics.disease_risk));
  healthMetrics.overall_wellness = Math.max(10, Math.min(100, healthMetrics.overall_wellness));
  
  // Calculate organ health based on relevant habits
  const organHealth = calculateOrganHealthFromHabits(habits);
  
  // Sort exponential factors by impact
  exponentialFactors.positive.sort((a, b) => b.impact - a.impact);
  exponentialFactors.negative.sort((a, b) => b.impact - a.impact);
  
  // Generate prioritized recommendations
  const prioritizedRecommendations = generateTargetedRecommendations(habits, exponentialFactors);
  
  return {
    overallHealth: healthMetrics.general_health,
    organHealth,
    exponentialFactors,
    riskAssessment: {
      physicalHealth: healthMetrics.physical_fitness,
      mentalHealth: healthMetrics.mental_health,
      lifeExpectancy: healthMetrics.life_expectancy,
      diseaseRisk: healthMetrics.disease_risk
    },
    prioritizedRecommendations
  };
};

/**
 * Calculate organ health based on habits that specifically affect each organ
 */
const calculateOrganHealthFromHabits = (habits: HabitLevels): Record<string, number> => {
  const organHealth = {
    lungs: 80,
    heart: 75,
    brain: 85,
    liver: 80,
    kidneys: 85,
    gut: 75,
    skin: 80
  };
  
  // Apply habit effects to specific organs
  Object.entries(habits).forEach(([habitId, habitData]) => {
    const level = habitData?.level || 0;
    if (level === 0) return;
    
    // Organ-specific effects based on medical evidence
    switch (habitId) {
      case 'smoking':
        organHealth.lungs -= level * 8;
        organHealth.heart -= level * 6;
        organHealth.skin -= level * 5;
        break;
      case 'alcohol':
        organHealth.liver -= level * 10;
        organHealth.brain -= level * 6;
        organHealth.gut -= level * 4;
        break;
      case 'drugs':
        organHealth.brain -= level * 12;
        organHealth.liver -= level * 8;
        organHealth.kidneys -= level * 8;
        organHealth.heart -= level * 6;
        break;
      case 'processed_diet':
        organHealth.gut -= level * 6;
        organHealth.liver -= level * 4;
        organHealth.heart -= level * 4;
        break;
      case 'chronic_stress':
        organHealth.brain -= level * 6;
        organHealth.heart -= level * 5;
        organHealth.gut -= level * 4;
        organHealth.skin -= level * 3;
        break;
      case 'exercise':
        organHealth.heart += level * 5;
        organHealth.lungs += level * 4;
        organHealth.brain += level * 3;
        break;
      case 'healthy_diet':
        organHealth.gut += level * 6;
        organHealth.liver += level * 4;
        organHealth.heart += level * 4;
        organHealth.brain += level * 3;
        break;
      case 'sleep_consistency':
        organHealth.brain += level * 5;
        organHealth.heart += level * 3;
        organHealth.liver += level * 3;
        break;
      case 'hydration':
        organHealth.kidneys += level * 4;
        organHealth.skin += level * 3;
        organHealth.brain += level * 2;
        break;
    }
  });
  
  // Ensure realistic bounds for all organs
  Object.keys(organHealth).forEach(organ => {
    organHealth[organ] = Math.max(15, Math.min(100, organHealth[organ]));
  });
  
  return organHealth;
};

/**
 * Generate explanations for targeted habit impacts
 */
const getTargetedExplanation = (habitId: string, metric: string, level: number, impact: number): string => {
  const habitName = habitsData.habits.find(h => h.id === habitId)?.name || habitId;
  const direction = impact > 0 ? 'improves' : 'reduces';
  const intensity = Math.abs(impact) > 15 ? 'dramatically' : Math.abs(impact) > 8 ? 'significantly' : 'moderately';
  
  return `${habitName} at level ${level} ${intensity} ${direction} ${metric.replace(/_/g, ' ')} by ${Math.round(Math.abs(impact))} points.`;
};

/**
 * Generate prioritized recommendations based on targeted effects
 */
const generateTargetedRecommendations = (habits: HabitLevels, exponentialFactors: any) => {
  const recommendations = [];
  
  // Critical: Address most harmful habits first
  const criticalHarmful = ['drugs', 'chronic_stress', 'smoking'];
  criticalHarmful.forEach(habitId => {
    const level = habits[habitId]?.level || 0;
    if (level > 0) {
      const habit = habitsData.habits.find(h => h.id === habitId);
      recommendations.push({
        priority: 'critical' as const,
        action: `Reduce ${habit?.name.toLowerCase()} immediately`,
        rationale: `This habit has severe negative effects on multiple health areas.`,
        expectedImpact: `Could improve overall health by 10-20 points.`
      });
    }
  });
  
  // High: Implement foundational beneficial habits
  const foundationalHabits = ['sleep_consistency', 'exercise', 'healthy_diet'];
  foundationalHabits.forEach(habitId => {
    const level = habits[habitId]?.level || 0;
    if (level < 2) {
      const habit = habitsData.habits.find(h => h.id === habitId);
      recommendations.push({
        priority: 'high' as const,
        action: `Improve ${habit?.name.toLowerCase()}`,
        rationale: `This foundational habit affects multiple health areas positively.`,
        expectedImpact: `Could improve overall health by 8-15 points.`
      });
    }
  });
  
  // Moderate: Optimize targeted beneficial habits
  const targetedHabits = ['social_connection', 'meditation', 'hydration'];
  targetedHabits.forEach(habitId => {
    const level = habits[habitId]?.level || 0;
    if (level < 3) {
      const habit = habitsData.habits.find(h => h.id === habitId);
      recommendations.push({
        priority: 'moderate' as const,
        action: `Increase ${habit?.name.toLowerCase()}`,
        rationale: `This habit provides targeted benefits for specific health areas.`,
        expectedImpact: `Could improve specific metrics by 5-10 points.`
      });
    }
  });
  
  return recommendations.slice(0, 5);
};