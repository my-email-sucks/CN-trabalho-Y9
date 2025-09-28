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

  // Use exponential organ health calculation
  const organHealth = meters.organHealth?.[focusOrganId] || 80;
  const healthRatio = organHealth / 100;
  
  const getOrganStatus = () => {
    if (healthRatio >= 0.8) return { status: 'Excelente', color: 'text-green-600', bg: 'bg-green-50' };
    if (healthRatio >= 0.6) return { status: 'Bom', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (healthRatio >= 0.4) return { status: 'Preocupante', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { status: 'Crítico', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const organStatus = getOrganStatus();

  // Generate personalized message based on exponential factors
  const generatePersonalizedMessage = () => {
    const exponentialFactors = meters.exponentialFactors || { positive: [], negative: [] };
    const organName = organ.name.toLowerCase();
    
    let message = `Os teus ${organName} estão `;
    
    if (organHealth >= 80) {
      message += 'em excelente estado';
    } else if (organHealth >= 60) {
      message += 'em bom estado, mas com alguns sinais de stress';
    } else if (organHealth >= 40) {
      message += 'em estado preocupante';
    } else {
      message += 'em estado crítico';
    }
    
    // Add exponential factor impacts
    const relevantNegative = exponentialFactors.negative.filter(f => 
      ['smoking', 'alcohol', 'drugs', 'chronic_stress', 'processed_diet'].includes(f.habit.toLowerCase().replace(/\s+/g, '_'))
    );
    
    const relevantPositive = exponentialFactors.positive.filter(f => 
      ['exercise', 'healthy_diet', 'sleep_consistency', 'hydration'].includes(f.habit.toLowerCase().replace(/\s+/g, '_'))
    );
    
    if (relevantNegative.length > 0) {
      message += `, principalmente devido aos efeitos exponenciais do ${relevantNegative[0].habit.toLowerCase()}`;
    }
    
    if (relevantPositive.length > 0) {
      message += `. Felizmente, o teu ${relevantPositive[0].habit.toLowerCase()} está a proporcionar benefícios exponenciais`;
    }
    
    message += `. Estado atual: ${Math.round(organHealth)}% de saúde.`;
    
    if (organHealth < 60) {
      message += ' Recomenda-se consultar um profissional de saúde.';
    }
    
    return message;
  };

  const personalizedMessage = generatePersonalizedMessage();
  const exponentialFactors = meters.exponentialFactors || { positive: [], negative: [] };
  const prioritizedRecommendations = meters.prioritizedRecommendations || [];
  
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
        {prioritizedRecommendations.length > 0 && (
          <div className="mx-6 mt-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Recomendações Exponenciais</h4>
            {prioritizedRecommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className={`p-3 rounded-lg flex items-start space-x-3 ${
                rec.priority === 'critical' ? 'bg-red-50' :
                rec.priority === 'high' ? 'bg-orange-50' :
                'bg-red-50'
              }`}>
                {rec.priority === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : rec.action.includes('Increase') || rec.action.includes('Improve') ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{rec.action}</p>
                  <p className="text-xs text-gray-600 mt-1">{rec.rationale}</p>
                  <p className="text-xs text-gray-500 mt-1">{rec.expectedImpact}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exponential Factors Affecting This Organ */}
        {(exponentialFactors.positive.length > 0 || exponentialFactors.negative.length > 0) && (
          <div className="mx-6 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Fatores Exponenciais</h4>
            <div className="space-y-2">
              {exponentialFactors.negative.slice(0, 2).map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <div>
                      <span className="text-sm font-medium">{factor.habit}</span>
                      <p className="text-xs text-gray-500">Impacto exponencial negativo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-red-600">
                      -{Math.round(factor.impact)}%
                    </span>
                  </div>
                </div>
              ))}
              {exponentialFactors.positive.slice(0, 2).map((factor, index) => (
                <div key={`pos-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">{factor.habit}</span>
                      <p className="text-xs text-gray-500">Benefício exponencial</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-green-600">
                      +{Math.round(factor.impact)}%
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
              {organHealth < 60 && <li>• Reduz gradualmente os hábitos prejudiciais</li>}
              {!selectedHabits['exercise']?.level && <li>• Aumenta a atividade física regular</li>}
              {!selectedHabits['healthy_diet']?.level && <li>• Mantém uma alimentação equilibrada</li>}
              {!selectedHabits['sleep_consistency']?.level && <li>• Garante um sono reparador</li>}
              {organHealth < 40 && <li>• Procura apoio médico se necessário</li>}
              {selectedHabits['smoking']?.level > 0 && <li>• Considera programas de cessação tabágica</li>}
              {selectedHabits['alcohol']?.level > 2 && <li>• Reduz o consumo de álcool gradualmente</li>}
              {!selectedHabits['hydration']?.level && <li>• Mantém uma hidratação adequada</li>}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            Esta informação usa cálculos exponenciais baseados em investigação médica e destina-se apenas a fins educativos. Consulta um profissional de saúde para orientação médica.
          </p>
        </div>
      </div>
    </div>
  );
};