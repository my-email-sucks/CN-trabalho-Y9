import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateExponentialHealth } from '../utils/exponentialHealthCalculator';

export interface HabitLevel {
  level: number;
}

export interface HabitLevels {
  [key: string]: HabitLevel;
}

interface MeterStats {
  cardioStrain: number;
  inflammation: number;
  sleepQuality: number;
  stressLoad: number;
  recoveryCapacity: number;
  cognitiveFunction: number;
  immuneSystem: number;
  metabolicHealth: number;
}

interface Meters {
  health: number;
  happiness: number;
  qualityOfLife: number;
  mentalHealth: number;
  lifeExpectancy: number;
  diseaseRisk: number;
  physicalFitness: number;
  overallWellness: number;
  stats: MeterStats;
  exponentialFactors: {
    positive: Array<{ habit: string, impact: number, explanation: string }>;
    negative: Array<{ habit: string, impact: number, explanation: string }>;
  };
  organHealth: Record<string, number>;
  prioritizedRecommendations: Array<{
    priority: 'critical' | 'high' | 'moderate';
    action: string;
    rationale: string;
    expectedImpact: string;
  }>;
}

interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
}

interface AtlasState {
  selectedHabits: HabitLevels;
  meters: Meters;
  focusOrganId: string | undefined;
  compareMode: 'off' | 'before' | 'after';
  accessibility: AccessibilitySettings;
  setHabitLevel: (habitId: string, level: number) => void;
  setFocusOrgan: (organId: string | undefined) => void;
  setCompareMode: (mode: 'off' | 'before' | 'after') => void;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
}

/**
 * EXPONENTIAL HEALTH IMPACT SYSTEM
 * 
 * This system implements exponential weighting for critical habits that have
 * disproportionate impacts on health outcomes. Some habits can override multiple
 * other factors, while others provide exponential benefits.
 * 
 * Based on epidemiological studies and longitudinal health research.
 */
const calculateMeters = (habits: HabitLevels): Meters => {
  // Use exponential health calculation system
  const exponentialResult = calculateExponentialHealth(habits);
  
  // Extract values from exponential calculation
  const health = exponentialResult.overallHealth;
  const happiness = exponentialResult.riskAssessment.mentalHealth;
  const mentalHealth = exponentialResult.riskAssessment.mentalHealth;
  const physicalFitness = exponentialResult.riskAssessment.physicalHealth;
  const lifeExpectancy = exponentialResult.riskAssessment.lifeExpectancy;
  const diseaseRisk = exponentialResult.riskAssessment.diseaseRisk;
  
  // Calculate composite metrics
  const qualityOfLife = Math.max(0, Math.min(100, (health + happiness + mentalHealth) / 3));
  const overallWellness = Math.max(0, Math.min(100, (health + happiness + physicalFitness) / 3));
  
  // Calculate detailed stats based on exponential factors
  const negativeImpact = exponentialResult.exponentialFactors.negative.reduce((sum, factor) => sum + factor.impact, 0);
  const positiveImpact = exponentialResult.exponentialFactors.positive.reduce((sum, factor) => sum + factor.impact, 0);
  
  const stats: MeterStats = {
    cardioStrain: Math.max(0, Math.min(10, 5 + (negativeImpact * 0.15) - (positiveImpact * 0.1))),
    inflammation: Math.max(0, Math.min(10, 5 + (negativeImpact * 0.12) - (positiveImpact * 0.08))),
    sleepQuality: Math.max(0, Math.min(10, 5 + ((habits.sleep_consistency?.level || 0) * 1.8) - ((habits.chronic_stress?.level || 0) * 1.5))),
    stressLoad: Math.max(0, Math.min(10, 5 + ((habits.chronic_stress?.level || 0) * 2.2) - ((habits.meditation?.level || 0) * 1.2))),
    recoveryCapacity: Math.max(0, Math.min(10, 5 + (positiveImpact * 0.1) - (negativeImpact * 0.08))),
    cognitiveFunction: Math.max(0, Math.min(10, 5 + (positiveImpact * 0.12) - (negativeImpact * 0.15))),
    immuneSystem: Math.max(0, Math.min(10, 5 + (positiveImpact * 0.1) - (negativeImpact * 0.12))),
    metabolicHealth: Math.max(0, Math.min(10, 5 + (positiveImpact * 0.11) - (negativeImpact * 0.14))),
  };
  
  return {
    health,
    happiness,
    qualityOfLife,
    mentalHealth,
    lifeExpectancy,
    diseaseRisk,
    physicalFitness,
    overallWellness,
    stats,
    exponentialFactors: exponentialResult.exponentialFactors,
    organHealth: exponentialResult.organHealth,
    prioritizedRecommendations: exponentialResult.prioritizedRecommendations,
  };
};

export const useAtlasStore = create<AtlasState>()(
  persist(
    (set, get) => ({
      selectedHabits: {},
      meters: calculateMeters({}),
      focusOrganId: undefined,
      compareMode: 'off',
      accessibility: {
        reduceMotion: false,
        highContrast: false,
      },
      
      setHabitLevel: (habitId: string, level: number) => {
        // Validate input
        if (typeof level !== 'number' || level < 0 || level > 3 || !Number.isInteger(level)) {
          console.error(`Invalid habit level: ${level} for habit ${habitId}`);
          return;
        }
        
        const currentHabits = get().selectedHabits;
        const newHabits = {
          ...currentHabits,
          [habitId]: { level }
        };
        
        try {
          const newMeters = calculateMeters(newHabits);
          set({
            selectedHabits: newHabits,
            meters: newMeters,
          });
        } catch (error) {
          console.error('Error calculating meters:', error);
        }
      },
      
      setFocusOrgan: (organId: string | undefined) => {
        set({ focusOrganId: organId });
      },
      
      setCompareMode: (mode: 'off' | 'before' | 'after') => {
        set({ compareMode: mode });
      },
      
      toggleReduceMotion: () => {
        set((state) => ({
          accessibility: {
            ...state.accessibility,
            reduceMotion: !state.accessibility.reduceMotion,
          },
        }));
      },
      
      toggleHighContrast: () => {
        set((state) => ({
          accessibility: {
            ...state.accessibility,
            highContrast: !state.accessibility.highContrast,
          },
        }));
      },
    }),
    {
      name: 'atlas-habits-storage',
      version: 2, // Incremented version for new calculation system
    }
  )
);