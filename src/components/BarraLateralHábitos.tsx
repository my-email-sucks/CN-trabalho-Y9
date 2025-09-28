import React from 'react';
import { Check } from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import habitsData from '../data/habits.json';

interface HabitControlProps {
  habit: any;
}

const HabitControl: React.FC<HabitControlProps> = ({ habit }) => {
  const { selectedHabits, setHabitLevel } = useAtlasStore();
  const currentLevel = selectedHabits[habit.id] ?? 0;

  const handleLevelChange = (level: number) => {
    // Add validation to prevent invalid states
    if (level < 0 || level > 3 || !Number.isInteger(level)) {
      console.warn(`Invalid level ${level} for habit ${habit.id}`);
      return;
    }
    setHabitLevel(habit.id, level);
  };

  const getButtonColor = (level: number, isSelected: boolean) => {
    if (habit.kind === 'bad') {
      // High-impact habits get more dramatic colors
      const isHighImpact = ['smoking', 'alcohol', 'drugs', 'pornography'].includes(habit.id);
      if (level === 0) return isSelected ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      if (isHighImpact) {
        if (level === 3) return isSelected ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200';
        if (level === 2) return isSelected ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200';
        return isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-500 hover:bg-red-200';
      }
      if (level === 3) return isSelected ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200';
      if (level === 2) return isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-500 hover:bg-orange-200';
      return isSelected ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-400 hover:bg-orange-200';
    } else {
      if (level === 0) return isSelected ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      if (level === 3) return isSelected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200';
      if (level === 2) return isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-500 hover:bg-green-200';
      return isSelected ? 'bg-green-400 text-white' : 'bg-green-100 text-green-400 hover:bg-green-200';
    }
  };

  return (
    <div className={`p-3 border rounded-lg transition-all duration-300 ${
      currentLevel > 0 
        ? habit.kind === 'bad' 
          ? 'border-red-300 bg-red-50 hover:border-red-400' 
          : 'border-green-300 bg-green-50 hover:border-green-400'
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${
          currentLevel > 0
            ? habit.kind === 'bad' ? 'text-red-800' : 'text-green-800'
            : habit.kind === 'bad' ? 'text-red-700' : 'text-green-700'
        }`}>
          {habit.name}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${
          currentLevel > 0
            ? habit.kind === 'bad' 
              ? 'text-red-700 bg-red-100' 
              : 'text-green-700 bg-green-100'
            : 'text-gray-500 bg-gray-100'
        }`}>
          {habit.category}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-1">
          {habit.intensity.labels.map((label, index) => (
            <button
              key={index}
              onClick={() => handleLevelChange(index)}
              className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
                getButtonColor(index, currentLevel === index)
              }`}
              aria-pressed={currentLevel === index}
              aria-label={`${habit.name}: ${label}`}
            >
              <div className="flex items-center justify-center space-x-1">
                {currentLevel === index && <Check className="w-3 h-3" />}
                <span>{label}</span>
              </div>
            </button>
          ))}
        </div>
        <div className={`text-xs text-center font-medium mt-2 ${
          currentLevel > 0
            ? habit.kind === 'bad' ? 'text-red-700' : 'text-green-700'
            : 'text-gray-600'
        }`}>
          Atual: {habit.intensity.labels[currentLevel]}
        </div>
      </div>
    </div>
  );
};

export const BarraLateralHábitos: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(['Substâncias', 'Atividade física', 'Mental'])
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Group habits by category
  const habitsByCategory = habitsData.habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, any[]>);

  // Separate bad and good habits
  const badHabits = habitsData.habits.filter(h => h.kind === 'bad');
  const goodHabits = habitsData.habits.filter(h => h.kind === 'good');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto max-h-screen">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Quais são os teus bons hábitos?</h2>
        <p className="text-sm text-gray-600 mt-1">
          Ajusta os controlos para ver o impacto
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Bad Habits Section */}
        <div>
          <div className="space-y-2 mb-4">
            {['Fumar', 'Beber álcool', 'Consumo de drogas', 'Pornografia', 'Dependência de videojogos', 'Sedentarismo', 'Dieta ultraprocessada'].map((habit, index) => (
              <div key={index} className="text-sm text-gray-700">{habit}</div>
            ))}
          </div>
          <div className="space-y-3">
            {badHabits.map((habit) => (
              <HabitControl key={habit.id} habit={habit} />
            ))}
          </div>
        </div>

        {/* Good Habits Section */}
        <div>
          <div className="space-y-3">
            {goodHabits.map((habit) => (
              <HabitControl key={habit.id} habit={habit} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};