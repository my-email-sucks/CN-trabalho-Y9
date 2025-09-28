import React from 'react';
import { X, Info, Heart, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';
import { calculateOrganHealth } from '../utils/organHealthCalculator';
import organsData from '../data/organs.json';

export const VistaDoÓrgão: React.FC = () => {
  const { focusOrganId, setFocusOrgan, meters, selectedHabits } = useAtlasStore();

  if (!focusOrganId) return null;

  const organ = organsData.organs.find(o => o.id === focusOrganId);
  if (!organ) return null;

  // Use evidence-based organ health calculation
  const organHealthData = calculateOrganHealth(focusOrganId, selectedHabits);
  const { health: organHealth, affectingHabits, riskLevel, personalizedMessage } = organHealthData;
  const healthRatio = organHealth / 100;
  
  const getOrganStatus = () => {
    if (healthRatio >= 0.8) return { status: 'Excelente', color: 'text-green-600', bg: 'bg-green-50' };
    if (healthRatio >= 0.6) return { status: 'Bom', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (healthRatio >= 0.4) return { status: 'Preocupante', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { status: 'Crítico', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const organStatus = getOrganStatus();

  const getPersonalizedAdvice = () => {
    const badHabits = affectingHabits.filter(h => h.type === 'harmful');
    const goodHabits = affectingHabits.filter(h => h.type === 'beneficial');
    
    let advice = [];
    
    if (badHabits.length > 0) {
      const worstHabit = badHabits.reduce((worst, current) => 
        Math.abs(current.impact) > Math.abs(worst.impact) ? current : worst
      );
      
      advice.push({
        type: 'warning',
        text: `O teu ${worstHabit.habitName.toLowerCase()} está a causar danos significativos a este órgão. Considera reduzir gradualmente este hábito.`,
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />
      });
    }
    
    if (goodHabits.length > 0) {
      const bestHabit = goodHabits.reduce((best, current) => 
        Math.abs(current.impact) > Math.abs(best.impact) ? current : best
      );
      
      advice.push({
        type: 'success',
        text: `O teu ${bestHabit.habitName.toLowerCase()} está a ter um impacto positivo. Continua assim!`,
        icon: <CheckCircle className="w-4 h-4 text-green-500" />
      });
    }
    
    if (organHealth < 60) {
      advice.push({
        type: 'critical',
        text: `Este órgão está em estado preocupante. Recomenda-se consultar um profissional de saúde.`,
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />
      });
    }
    
    return advice;
  };

  const personalizedAdvice = getPersonalizedAdvice();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{organ.name}</h2>
              <p className="text-sm text-gray-600">Sistema {organ.system}</p>
            </div>
          </div>
          <button
            onClick={() => setFocusOrgan(undefined)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar vista do órgão"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Status */}
        <div className={`mx-6 mt-6 p-4 rounded-lg ${organStatus.bg}`}>
          <div className="flex items-center space-x-2">
            <Info className={`w-5 h-5 ${organStatus.color}`} />
            <span className={`font-semibold ${organStatus.color}`}>
              Estado atual: {organStatus.status}
            </span>
            <span className="text-sm text-gray-600">
              ({Math.round(organHealth)}% de saúde)
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            {personalizedMessage}
          </p>
        </div>

        {/* Personalized Advice */}
        {personalizedAdvice.length > 0 && (
          <div className="mx-6 mt-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Conselhos Personalizados</h4>
            {personalizedAdvice.map((advice, index) => (
              <div key={index} className={`p-3 rounded-lg flex items-start space-x-3 ${
                advice.type === 'warning' ? 'bg-orange-50' :
                advice.type === 'success' ? 'bg-green-50' :
                'bg-red-50'
              }`}>
                {advice.icon}
                <p className="text-sm text-gray-700 flex-1">{advice.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Current Habits Affecting This Organ */}
        {affectingHabits.length > 0 && (
          <div className="mx-6 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Hábitos que Afetam Este Órgão</h4>
            <div className="space-y-2">
              {affectingHabits.map(({ habitName, impact, level, mechanism }, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    {impact > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <div>
                      <span className="text-sm font-medium">{habitName}</span>
                      <p className="text-xs text-gray-500">{mechanism}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      Nível {level}
                    </span>
                    <span className={`text-xs font-medium ${
                      impact > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {impact > 0 ? '+' : ''}{Math.round(Math.abs(impact))}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* What Happens Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-2 h-6 bg-red-500 rounded-full mr-3"></span>
            O que acontece
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            {organ.narration.what_happens}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="w-2 h-6 bg-green-500 rounded-full mr-3"></span>
            O que ajuda
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            {organ.narration.what_helps}
          </p>

          {/* Metrics */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Métricas Monitorizadas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {organ.metrics.map((metric) => (
                <div key={metric} className="bg-gray-50 p-3 rounded-lg text-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {metric.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Dicas de Recuperação</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {riskLevel === 'high' || riskLevel === 'critical' && <li>• Reduz gradualmente os hábitos prejudiciais</li>}
              {!selectedHabits['exercise']?.level && <li>• Aumenta a atividade física regular</li>}
              {!selectedHabits['healthy_diet']?.level && <li>• Mantém uma alimentação equilibrada</li>}
              {!selectedHabits['sleep_consistency']?.level && <li>• Garante um sono reparador</li>}
              {riskLevel === 'critical' && <li>• Procura apoio médico se necessário</li>}
              {selectedHabits['smoking']?.level > 0 && <li>• Considera programas de cessação tabágica</li>}
              {selectedHabits['alcohol']?.level > 2 && <li>• Reduz o consumo de álcool gradualmente</li>}
              {!selectedHabits['hydration']?.level && <li>• Mantém uma hidratação adequada</li>}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            Esta informação é apenas educativa. Consulta um profissional de saúde para orientação médica.
          </p>
        </div>
      </div>
    </div>
  );
};