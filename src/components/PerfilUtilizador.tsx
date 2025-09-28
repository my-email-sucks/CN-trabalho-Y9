import React from 'react';
import { User, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import habitsData from '../data/habits.json';

export const PerfilUtilizador: React.FC = () => {
  const { selectedHabits, meters } = useAtlasStore();

  const getHabitSummary = () => {
    const badHabits = [];
    const goodHabits = [];
    let totalBadImpact = 0;
    let totalGoodImpact = 0;

    Object.entries(selectedHabits).forEach(([habitId, { level }]) => {
      const habit = habitsData.habits.find(h => h.id === habitId);
      if (!habit || level === 0) return;

      const intensityScalar = [0, 0.5, 0.8, 1.0][level];
      const impact = intensityScalar * 100;

      if (habit.kind === 'bad') {
        badHabits.push({ habit, level, impact });
        totalBadImpact += impact;
      } else {
        goodHabits.push({ habit, level, impact });
        totalGoodImpact += impact;
      }
    });

    return { badHabits, goodHabits, totalBadImpact, totalGoodImpact };
  };

  const getHealthCategory = () => {
    const health = meters.health;
    if (health >= 85) return { category: 'Excelente', color: 'text-green-600', bg: 'bg-green-50' };
    if (health >= 70) return { category: 'Boa', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (health >= 55) return { category: 'Moderada', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (health >= 40) return { category: 'Preocupante', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { category: 'Crítica', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getTopRecommendations = () => {
    const { badHabits, goodHabits } = getHabitSummary();
    const recommendations = [];

    // Recommend reducing worst bad habit
    if (badHabits.length > 0) {
      const worstHabit = badHabits.reduce((worst, current) => 
        current.level > worst.level ? current : worst
      );
      recommendations.push({
        type: 'reduce',
        text: `Reduzir ${worstHabit.habit.name.toLowerCase()}`,
        priority: 'high'
      });
    }

    // Recommend increasing best potential good habit
    const missingGoodHabits = habitsData.habits
      .filter(h => h.kind === 'good' && (!selectedHabits[h.id] || selectedHabits[h.id].level === 0))
      .slice(0, 2);

    missingGoodHabits.forEach(habit => {
      recommendations.push({
        type: 'increase',
        text: `Começar ${habit.name.toLowerCase()}`,
        priority: 'medium'
      });
    });

    return recommendations.slice(0, 3);
  };

  const { badHabits, goodHabits, totalBadImpact, totalGoodImpact } = getHabitSummary();
  const healthCategory = getHealthCategory();
  const recommendations = getTopRecommendations();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Perfil de Saúde</h3>
          <p className="text-sm text-gray-600">Resumo personalizado</p>
        </div>
      </div>

      {/* Health Status */}
      <div className={`p-4 rounded-lg mb-6 ${healthCategory.bg}`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`font-semibold ${healthCategory.color}`}>
              Estado: {healthCategory.category}
            </span>
            <p className="text-sm text-gray-700 mt-1">
              Saúde geral: {Math.round(meters.health)}%
            </p>
          </div>
          {meters.health >= 70 ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <AlertCircle className="w-8 h-8 text-orange-500" />
          )}
        </div>
      </div>

      {/* Habit Balance */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Equilíbrio de Hábitos</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="font-bold text-red-700">{badHabits.length}</span>
            </div>
            <span className="text-xs text-red-600">Hábitos Prejudiciais</span>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="font-bold text-green-700">{goodHabits.length}</span>
            </div>
            <span className="text-xs text-green-600">Hábitos Benéficos</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Métricas Principais</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Felicidade:</span>
            <span className="font-medium">{Math.round(meters.happiness)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Qualidade de Vida:</span>
            <span className="font-medium">{Math.round(meters.qualityOfLife)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Esperança de Vida:</span>
            <span className="font-medium">{Math.round(meters.lifeExpectancy)} anos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Risco de Doença:</span>
            <span className={`font-medium ${
              meters.diseaseRisk > 50 ? 'text-red-600' : 
              meters.diseaseRisk > 30 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {Math.round(meters.diseaseRisk)}%
            </span>
          </div>
        </div>
      </div>

      {/* Top Recommendations */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Recomendações Prioritárias</h4>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-3 rounded-lg text-sm ${
              rec.priority === 'high' ? 'bg-red-50 text-red-800' :
              rec.priority === 'medium' ? 'bg-blue-50 text-blue-800' :
              'bg-gray-50 text-gray-800'
            }`}>
              <div className="flex items-center space-x-2">
                {rec.type === 'reduce' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                <span className="font-medium">{rec.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>Este perfil é baseado nos hábitos selecionados e destina-se apenas a fins educativos. Consulta um profissional de saúde para orientação personalizada.</p>
      </div>
    </div>
  );
};