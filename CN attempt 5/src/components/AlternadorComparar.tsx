import React from 'react';
import { RotateCcw, Eye } from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';

export const AlternadorComparar: React.FC = () => {
  const { compareMode, setCompareMode } = useAtlasStore();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Comparar</h3>
        <Eye className="w-5 h-5 text-gray-500" />
      </div>

      <div className="space-y-3">
        {/* Toggle Switch */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <button
              onClick={() => setCompareMode(compareMode === 'off' ? 'before' : 'off')}
              className={`w-12 h-6 rounded-full transition-colors ${
                compareMode !== 'off' ? 'bg-gray-400' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                compareMode !== 'off' ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {compareMode !== 'off' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCompareMode('before')}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                compareMode === 'before'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Antes
            </button>
            <button
              onClick={() => setCompareMode('after')}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                compareMode === 'after'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Depois
            </button>
          </div>
        )}

        {/* Heart comparison visualization */}
        {compareMode !== 'off' && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-red-400 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-500 rounded" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}></div>
                </div>
                <span className="text-xs text-gray-600">Antes</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-red-300 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-400 rounded" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}></div>
                </div>
                <span className="text-xs text-gray-600">Depois</span>
              </div>
            </div>
          </div>
        )}

        {compareMode !== 'off' && (
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg mt-4">
            {compareMode === 'before' && (
              <p>A mostrar o estado <strong>antes</strong> das mudanças de hábitos. Alterna para "Depois" para ver a diferença.</p>
            )}
            {compareMode === 'after' && (
              <p>A mostrar o estado <strong>depois</strong> das mudanças de hábitos. Compara com o estado "Antes".</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};