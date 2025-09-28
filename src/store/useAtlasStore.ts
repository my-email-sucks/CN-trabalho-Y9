import { create } from 'zustand';

interface HabitLevel {
  [key: string]: number;
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
  selectedHabits: HabitLevel;
  meters: Meters;
  focusOrganId: string | null;
  compareMode: boolean;
  accessibility: AccessibilitySettings;
  setHabitLevel: (habitId: string, level: number) => void;
  setFocusOrgan: (organId: string | null) => void;
  setCompareMode: (enabled: boolean) => void;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
}

const calculateMeters = (habits: HabitLevel): Meters => {
  // Add error handling and validation
  const validHabits = Object.entries(habits).filter(([_, level]) => {
    return typeof level === 'number' && level >= 0 && level <= 3 && Number.isInteger(level);
  });
  
  const habitValues = validHabits.map(([_, level]) => level);
  const avgHabit = habitValues.length > 0 ? habitValues.reduce((a, b) => a + b, 0) / habitValues.length : 50;
  
  // Clamp values to prevent extreme calculations
  const clampedAvg = Math.max(0, Math.min(100, avgHabit * 25)); // Convert 0-3 scale to 0-100
  
  // Base calculations with some randomness for realism
  const baseHealth = Math.min(100, Math.max(0, clampedAvg + (Math.random() - 0.5) * 10));
  const baseHappiness = Math.min(100, Math.max(0, clampedAvg * 0.9 + (Math.random() - 0.5) * 15));
  
  return {
    health: baseHealth,
    happiness: baseHappiness,
    qualityOfLife: Math.min(100, Math.max(0, (baseHealth + baseHappiness) / 2 + (Math.random() - 0.5) * 8)),
    mentalHealth: Math.min(100, Math.max(0, baseHappiness * 0.95 + (Math.random() - 0.5) * 12)),
    lifeExpectancy: Math.min(100, Math.max(60, 75 + (baseHealth - 50) * 0.3)),
    diseaseRisk: Math.min(100, Math.max(0, 100 - baseHealth + (Math.random() - 0.5) * 20)),
    physicalFitness: Math.min(100, Math.max(0, clampedAvg * 0.8 + (Math.random() - 0.5) * 15)),
    overallWellness: Math.min(100, Math.max(0, (baseHealth + baseHappiness) / 2 + (Math.random() - 0.5) * 10)),
    stats: {
      cardioStrain: Math.min(10, Math.max(0, 10 - (clampedAvg / 10) + (Math.random() - 0.5) * 2)),
      inflammation: Math.min(10, Math.max(0, 10 - (clampedAvg / 10) + (Math.random() - 0.5) * 2)),
      sleepQuality: Math.min(10, Math.max(0, (clampedAvg / 10) + (Math.random() - 0.5) * 1.5)),
      stressLoad: Math.min(10, Math.max(0, 10 - (clampedAvg / 10) + (Math.random() - 0.5) * 2)),
      recoveryCapacity: Math.min(10, Math.max(0, (clampedAvg / 10) + (Math.random() - 0.5) * 1.5)),
      cognitiveFunction: Math.min(10, Math.max(0, (clampedAvg / 10) + (Math.random() - 0.5) * 1.5)),
      immuneSystem: Math.min(10, Math.max(0, (clampedAvg / 10) + (Math.random() - 0.5) * 1.5)),
      metabolicHealth: Math.min(10, Math.max(0, (clampedAvg / 10) + (Math.random() - 0.5) * 1.5)),
    },
  };
};

export const useAtlasStore = create<AtlasState>((set, get) => ({
  selectedHabits: {},
  meters: calculateMeters({}),
  focusOrganId: null,
  compareMode: false,
  accessibility: {
    reduceMotion: false,
    highContrast: false,
  },
  
  setHabitLevel: (habitId: string, level: number) => {
    // Validate input before setting
    if (typeof level !== 'number' || level < 0 || level > 3 || !Number.isInteger(level)) {
      console.error(`Invalid habit level: ${level} for habit ${habitId}`);
      return;
    }
    
    const newHabits = { ...get().selectedHabits, [habitId]: level };
    
    try {
      const newMeters = calculateMeters(newHabits);
      set({
        selectedHabits: newHabits,
        meters: newMeters,
      });
    } catch (error) {
      console.error('Error calculating meters:', error);
      // Revert to previous state if calculation fails
    }
  },
  
  setFocusOrgan: (organId: string | null) => {
    set({ focusOrganId: organId });
  },
  
  setCompareMode: (enabled: boolean) => {
    set({ compareMode: enabled });
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
}));