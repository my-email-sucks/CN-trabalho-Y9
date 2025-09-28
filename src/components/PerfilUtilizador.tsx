import React from 'react';
import { X, Info, Heart, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Activity, Brain, Smile } from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';

export const PerfilUtilizador: React.FC = () => {
  const { meters, selectedHabits, setShowUserProfile, showUserProfile } = useAtlasStore();

  if (!showUserProfile) return null;

  // Calculate overall health metrics
  const overallHealth = meters.overallHealth || 75;
  const mentalHealth = meters.mentalHealth || 75;
  const happiness = meters.happiness || 75;
  const qualityOfLife = meters.qualityOfLife || 75;
  const physicalFitness = meters.physicalFitness || 75;
  const lifeExpectancy = meters.lifeExpectancy || 78;

  // Get exponential factors for recommendations
  const exponentialFactors = meters.exponentialFactors || { positive: [], negative: [] };
  
  const getHealthStatus = (value: number) => {
    if (value >= 80) return { status: 'Excelente', color: 'text-green-600', bg: 'bg-green-50' };
    if (value >= 65) return { status: 'Bom', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (value >= 50) return { status: 'Preocupante', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { status: 'Crítico', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const overallStatus = getHealthStatus(overallHealth);

  const getPrioritizedRecommendations = () => {
    const recommendations = [];
    
    // Critical recommendations for exponentially harmful habits
    exponentialFactors.negative.forEach(factor => {
      if (factor.impact < -15) {
        recommendations.push({
          priority: 'critical',
          text: `Reduzir ${factor.habit.toLowerCase()} é crítico - tem impacto exponencial negativo na tua saúde geral.`,
          icon: <AlertTriangle className="w-4 h-4 text-red-500" />
        });
      }
    });

    // High priority for missing exponentially beneficial habits
    const beneficialHabits = ['exercise', 'sleep_consistency', 'healthy_diet', 'social_connection'];
    beneficialHabits.forEach(habit => {
      if (!selectedHabits[habit] || selectedHabits[habit].level === 0) {
        const habitNames = {
          exercise: 'exercício físico',
          sleep_consistency: 'sono consistente',
          healthy_diet: 'alimentação saudável',
          social_connection: 'conexão social'
        };
        
        recommendations.push({
          priority: 'high',
          text: `Implementar ${habitNames[habit]} pode ter benefícios exponenciais na tua saúde.`,
          icon: <CheckCircle className="w-4 h-4 text-green-500" />
        });
      }
    });

    // Moderate recommendations for optimization
    if (overallHealth < 70) {
      recommendations.push({
        priority: 'moderate',
        text: 'Considera consultar um profissional de saúde para orientação personalizada.',
        icon: <Info className="w-4 h-4 text-blue-500" />
      });
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  };

  const recommendations = getPrioritizedRecommendations();

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
              <h2 className="text-xl font-semibold text-gray-900">Perfil de Saúde</h2>
              <p className="text-sm text-gray-600">Resumo geral do teu bem-estar</p>
            </div>
          </div>
          <button
            onClick={() => setShowUserProfile(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar perfil do utilizador"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Overall Status */}
        <div className={`mx-6 mt-6 p-4 rounded-lg ${overallStatus.bg}`}>
          <div className="flex items-center space-x-2">
            <Info className={`w-5 h-5 ${overallStatus.color}`} />
            <span className={`font-semibold ${overallStatus.color}`}>
              Estado geral: {overallStatus.status}
            </span>
            <span className="text-sm text-gray-600">
              ({Math.round(overallHealth)}% de saúde geral)
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            Com base nos teus hábitos atuais, a tua esperança de vida estimada é de {Math.round(lifeExpectancy)} anos.
          </p>
        </div>

        {/* Health Metrics Grid */}
        <div className="mx-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Saúde</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-red-500" />
                <span className="font-medium text-gray-900">Saúde Física</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(physicalFitness)}%</div>
              <div className="text-sm text-gray-600">Condição física geral</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900">Saúde Mental</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(mentalHealth)}%</div>
              <div className="text-sm text-gray-600">Bem-estar psicológico</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Smile className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-gray-900">Felicidade</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(happiness)}%</div>
              <div className="text-sm text-gray-600">Satisfação diária</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-900">Qualidade de Vida</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(qualityOfLife)}%</div>
              <div className="text-sm text-gray-600">Bem-estar geral</div>
            </div>
          </div>
        </div>

        {/* Exponential Factors Summary */}
        {(exponentialFactors.positive.length > 0 || exponentialFactors.negative.length > 0) && (
          <div className="mx-6 mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Fatores de Alto Impacto</h4>
            <div className="space-y-2">
              {exponentialFactors.positive.slice(0, 3).map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{factor.habit}</span>
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    +{Math.round(Math.abs(factor.impact))}%
                  </span>
                </div>
              ))}
              {exponentialFactors.negative.slice(0, 3).map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">{factor.habit}</span>
                  </div>
                  <span className="text-xs font-medium text-red-600">
                    {Math.round(factor.impact)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prioritized Recommendations */}
        {recommendations.length > 0 && (
          <div className="mx-6 mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900">Recomendações Prioritárias</h4>
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-3 rounded-lg flex items-start space-x-3 ${
                rec.priority === 'critical' ? 'bg-red-50' :
                rec.priority === 'high' ? 'bg-green-50' :
                'bg-blue-50'
              }`}>
                {rec.icon}
                <p className="text-sm text-gray-700 flex-1">{rec.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t mt-6">
          <p className="text-xs text-gray-500 text-center">
            Esta informação é apenas educativa. Consulta um profissional de saúde para orientação médica.
          </p>
        </div>
      </div>
    </div>
  );
};