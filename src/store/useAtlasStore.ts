import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import habitsData from '../data/habits.json';

interface HabitLevel {
  level: number;
}

interface HabitLevels {
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
 * HABIT CLASSIFICATION AND IMPACT RANKING SYSTEM
 * 
 * Beneficial Habits (Positive Impact):
 * - exercise: 10/10 - Highest positive impact, affects multiple systems
 * - sleep_consistency: 9/10 - Critical for recovery and mental health
 * - healthy_diet: 8/10 - Foundation of physical health
 * - social_connection: 8/10 - Major impact on mental health and longevity
 * - meditation: 7/10 - Strong mental health benefits
 * - hydration: 6/10 - Basic but important physiological need
 * - reading: 5/10 - Cognitive benefits, moderate impact
 * - journaling: 4/10 - Mental clarity, lower but consistent impact
 * 
 * Harmful Habits (Negative Impact):
 * - smoking: 10/10 - Highest negative impact, affects all systems
 * - drugs: 10/10 - Severe impact on brain and multiple organs
 * - alcohol: 9/10 - Major impact on liver, brain, and overall health
 * - chronic_stress: 8/10 - Systemic negative effects
 * - sedentary: 8/10 - Major contributor to multiple health issues
 * - processed_diet: 7/10 - Significant impact on gut and metabolic health
 * - pornography: 6/10 - Mental health and dopamine system impact
 * - gaming: 5/10 - Moderate impact, mainly behavioral and social
 * - social_isolation: 7/10 - Strong negative impact on mental health
 */

const HABIT_IMPACT_WEIGHTS = {
  // Beneficial habits (positive impact)
  exercise: 10,
  sleep_consistency: 9,
  healthy_diet: 8,
  social_connection: 8,
  meditation: 7,
  hydration: 6,
  reading: 5,
  journaling: 4,
  
  // Harmful habits (negative impact)
  smoking: -10,
  drugs: -10,
  alcohol: -9,
  chronic_stress: -8,
  sedentary: -8,
  processed_diet: -7,
  social_isolation: -7,
  pornography: -6,
  gaming: -5,
};

/**
 * Calculate comprehensive health metrics based on habit levels
 * Uses weighted impact system with realistic interactions between habits
 */
const calculateMeters = (habits: HabitLevels): Meters => {
  let totalImpact = 0;
  let physicalImpact = 0;
  let mentalImpact = 0;
  let socialImpact = 0;
  
  // Calculate weighted impacts for each habit category
  Object.entries(habits).forEach(([habitId, habitData]) => {
    const level = habitData?.level || 0;
    if (level === 0) return;
    
    const habit = habitsData.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const baseWeight = HABIT_IMPACT_WEIGHTS[habitId] || 0;
    const intensityScalar = [0, 0.4, 0.7, 1.0][level]; // More realistic scaling
    const impact = baseWeight * intensityScalar;
    
    totalImpact += impact;
    
    // Categorize impacts for more nuanced calculations
    if (['exercise', 'sleep_consistency', 'healthy_diet', 'hydration', 'smoking', 'alcohol', 'drugs', 'sedentary', 'processed_diet'].includes(habitId)) {
      physicalImpact += impact;
    }
    
    if (['meditation', 'reading', 'journaling', 'chronic_stress', 'pornography', 'gaming'].includes(habitId)) {
      mentalImpact += impact;
    }
    
    if (['social_connection', 'social_isolation'].includes(habitId)) {
      socialImpact += impact;
    }
  });
  
  // Apply habit interactions and synergies
  const exerciseLevel = habits.exercise?.level || 0;
  const meditationLevel = habits.meditation?.level || 0;
  const socialLevel = habits.social_connection?.level || 0;
  
  // Positive synergies between good habits
  if (exerciseLevel > 0 && meditationLevel > 0) {
    totalImpact += 2; // Exercise + meditation synergy
  }
  if (exerciseLevel > 0 && socialLevel > 0) {
    totalImpact += 1.5; // Exercise + social synergy
  }
  
  // Negative compounding effects for bad habits
  const smokingLevel = habits.smoking?.level || 0;
  const alcoholLevel = habits.alcohol?.level || 0;
  const sedentaryLevel = habits.sedentary?.level || 0;
  
  if (smokingLevel > 0 && alcoholLevel > 0) {
    totalImpact -= 3; // Smoking + alcohol compound damage
  }
  if (sedentaryLevel > 0 && (habits.processed_diet?.level || 0) > 0) {
    totalImpact -= 2; // Sedentary + poor diet compound effect
  }
  
  // Convert impacts to 0-100 scale with realistic baselines
  const baselineHealth = 50; // Neutral starting point
  const health = Math.max(0, Math.min(100, baselineHealth + (totalImpact * 2.5)));
  
  const baselineHappiness = 50;
  const happiness = Math.max(0, Math.min(100, baselineHappiness + (mentalImpact * 3) + (socialImpact * 2.5) + (physicalImpact * 1.5)));
  
  const baselineMentalHealth = 50;
  const mentalHealth = Math.max(0, Math.min(100, baselineMentalHealth + (mentalImpact * 3.5) + (socialImpact * 2)));
  
  const qualityOfLife = Math.max(0, Math.min(100, (health + happiness + mentalHealth) / 3));
  
  // Life expectancy calculation (baseline 78 years)
  const lifeExpectancy = Math.max(65, Math.min(95, 78 + (totalImpact * 0.8)));
  
  // Disease risk (inverse of health with additional factors)
  const diseaseRisk = Math.max(5, Math.min(85, 100 - health + (Math.abs(physicalImpact) * 2)));
  
  // Physical fitness (heavily weighted by exercise and physical habits)
  const physicalFitness = Math.max(0, Math.min(100, 50 + (physicalImpact * 3) + (exerciseLevel * 15)));
  
  const overallWellness = Math.max(0, Math.min(100, (health + happiness + qualityOfLife) / 3));
  
  // Detailed stats calculations
  const stats: MeterStats = {
    cardioStrain: Math.max(0, Math.min(10, 5 - (physicalImpact * 0.3) + (smokingLevel * 2) + (sedentaryLevel * 1.5))),
    inflammation: Math.max(0, Math.min(10, 5 - (totalImpact * 0.2) + (habits.processed_diet?.level || 0) * 1.5)),
    sleepQuality: Math.max(0, Math.min(10, 5 + ((habits.sleep_consistency?.level || 0) * 2) - ((habits.chronic_stress?.level || 0) * 1.5))),
    stressLoad: Math.max(0, Math.min(10, 5 + ((habits.chronic_stress?.level || 0) * 2) - ((meditationLevel + socialLevel) * 0.8))),
    recoveryCapacity: Math.max(0, Math.min(10, 5 + (physicalImpact * 0.4) + ((habits.sleep_consistency?.level || 0) * 1.5))),
    cognitiveFunction: Math.max(0, Math.min(10, 5 + (mentalImpact * 0.4) + ((habits.reading?.level || 0) * 1.2))),
    immuneSystem: Math.max(0, Math.min(10, 5 + (totalImpact * 0.3) + (exerciseLevel * 1.2))),
    metabolicHealth: Math.max(0, Math.min(10, 5 + (physicalImpact * 0.4) - ((habits.processed_diet?.level || 0) * 1.8))),
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
      version: 1,
    }
  )
);