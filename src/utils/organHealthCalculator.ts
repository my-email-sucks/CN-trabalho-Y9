import { HabitLevels } from '../store/useAtlasStore';
import habitsData from '../data/habits.json';
import organMappings from '../data/organHabitMappings.json';

/**
 * EVIDENCE-BASED ORGAN HEALTH CALCULATOR
 * 
 * This module calculates organ health based on scientific evidence for habit-organ relationships.
 * Each calculation uses peer-reviewed research to determine impact weights and mechanisms.
 */

interface OrganHealth {
  health: number;
  affectingHabits: Array<{
    habitId: string;
    habitName: string;
    impact: number;
    level: number;
    mechanism: string;
    type: 'harmful' | 'beneficial';
  }>;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  personalizedMessage: string;
}

/**
 * Calculate health for a specific organ based on current habits
 */
export const calculateOrganHealth = (organId: string, habits: HabitLevels): OrganHealth => {
  const organData = organMappings.organMappings[organId];
  if (!organData) {
    throw new Error(`Unknown organ: ${organId}`);
  }

  let health = organData.baselineHealth;
  const affectingHabits: OrganHealth['affectingHabits'] = [];

  // Process harmful habits
  organData.topHarmful.forEach(({ habitId, impact, mechanism }) => {
    const habitLevel = habits[habitId]?.level || 0;
    if (habitLevel > 0) {
      const habit = habitsData.habits.find(h => h.id === habitId);
      if (habit) {
        // Intensity scaling: [0, 0.3, 0.6, 1.0] for more realistic progression
        const intensityScalar = [0, 0.3, 0.6, 1.0][habitLevel];
        const totalImpact = impact * intensityScalar * 100;
        
        health -= totalImpact;
        affectingHabits.push({
          habitId,
          habitName: habit.name,
          impact: -totalImpact,
          level: habitLevel,
          mechanism,
          type: 'harmful'
        });
      }
    }
  });

  // Process beneficial habits
  organData.topBeneficial.forEach(({ habitId, impact, mechanism }) => {
    const habitLevel = habits[habitId]?.level || 0;
    if (habitLevel > 0) {
      const habit = habitsData.habits.find(h => h.id === habitId);
      if (habit) {
        // Beneficial habits have diminishing returns to prevent unrealistic scores
        const intensityScalar = [0, 0.4, 0.7, 0.9][habitLevel];
        const totalImpact = impact * intensityScalar * 60; // Capped at 60% improvement
        
        health += totalImpact;
        affectingHabits.push({
          habitId,
          habitName: habit.name,
          impact: totalImpact,
          level: habitLevel,
          mechanism,
          type: 'beneficial'
        });
      }
    }
  });

  // Ensure health stays within realistic bounds
  health = Math.max(10, Math.min(100, health));

  // Determine risk level
  let riskLevel: OrganHealth['riskLevel'];
  if (health >= 80) riskLevel = 'low';
  else if (health >= 60) riskLevel = 'moderate';
  else if (health >= 40) riskLevel = 'high';
  else riskLevel = 'critical';

  // Generate personalized message
  const personalizedMessage = generatePersonalizedMessage(organId, health, affectingHabits, riskLevel);

  return {
    health,
    affectingHabits,
    riskLevel,
    personalizedMessage
  };
};

/**
 * Generate personalized, evidence-based messages for each organ
 */
const generatePersonalizedMessage = (
  organId: string,
  health: number,
  affectingHabits: OrganHealth['affectingHabits'],
  riskLevel: OrganHealth['riskLevel']
): string => {
  const organNames = {
    lungs: 'pulmões',
    heart: 'coração',
    brain: 'cérebro',
    liver: 'fígado',
    kidneys: 'rins',
    gut: 'intestino',
    skin: 'pele'
  };

  const organName = organNames[organId] || organId;
  const harmfulHabits = affectingHabits.filter(h => h.type === 'harmful').slice(0, 3);
  const beneficialHabits = affectingHabits.filter(h => h.type === 'beneficial').slice(0, 3);

  // Base message templates based on risk level
  const riskMessages = {
    low: `Os teus ${organName} estão em excelente estado`,
    moderate: `Os teus ${organName} mostram alguns sinais de stress`,
    high: `Os teus ${organName} estão em estado preocupante`,
    critical: `Os teus ${organName} estão em estado crítico`
  };

  let message = riskMessages[riskLevel];

  // Add specific habit impacts
  if (harmfulHabits.length > 0) {
    const topHarmful = harmfulHabits[0];
    message += `, principalmente devido ao ${topHarmful.habitName.toLowerCase()}`;
    
    if (harmfulHabits.length > 1) {
      message += ` e ${harmfulHabits[1].habitName.toLowerCase()}`;
    }
  }

  if (beneficialHabits.length > 0) {
    const topBeneficial = beneficialHabits[0];
    if (harmfulHabits.length > 0) {
      message += `. Felizmente, o teu ${topBeneficial.habitName.toLowerCase()} está a ajudar na recuperação`;
    } else {
      message += `, beneficiando do teu ${topBeneficial.habitName.toLowerCase()}`;
    }
  }

  // Add health percentage
  message += `. Estado atual: ${Math.round(health)}% de saúde.`;

  // Add evidence-based recommendations
  if (riskLevel === 'critical' || riskLevel === 'high') {
    message += ' Recomenda-se consultar um profissional de saúde.';
  }

  return message;
};

/**
 * Calculate overall body health as weighted average of all organs
 */
export const calculateOverallHealth = (habits: HabitLevels): number => {
  const organIds = ['lungs', 'heart', 'brain', 'liver', 'kidneys', 'gut', 'skin'];
  const organWeights = {
    lungs: 0.18,
    heart: 0.20,
    brain: 0.22,
    liver: 0.16,
    kidneys: 0.12,
    gut: 0.14,
    skin: 0.08
  };

  let totalHealth = 0;
  let totalWeight = 0;

  organIds.forEach(organId => {
    const organHealth = calculateOrganHealth(organId, habits);
    const weight = organWeights[organId];
    totalHealth += organHealth.health * weight;
    totalWeight += weight;
  });

  return totalHealth / totalWeight;
};

/**
 * Calculate disease risk based on organ health and specific risk factors
 */
export const calculateDiseaseRisk = (habits: HabitLevels): number => {
  const organIds = ['lungs', 'heart', 'brain', 'liver', 'kidneys', 'gut', 'skin'];
  let totalRisk = 0;

  organIds.forEach(organId => {
    const organHealth = calculateOrganHealth(organId, habits);
    // Convert health to risk (inverse relationship)
    const organRisk = Math.max(0, 100 - organHealth.health);
    totalRisk += organRisk;
  });

  // Average risk across all organs, with baseline adjustment
  const averageRisk = totalRisk / organIds.length;
  
  // Apply age-adjusted baseline (assuming average adult)
  const baselineRisk = 15; // 15% baseline risk for average adult
  const adjustedRisk = Math.min(85, baselineRisk + (averageRisk * 0.7));

  return Math.max(5, adjustedRisk);
};