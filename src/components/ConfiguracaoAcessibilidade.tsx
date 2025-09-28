import React from 'react';
import { Settings, Eye, Zap } from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';

export const ConfiguracaoAcessibilidade: React.FC = () => {
  const { accessibility, toggleReduceMotion, toggleHighContrast } = useAtlasStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Acessibilidade</h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.reduceMotion}
            onChange={toggleReduceMotion}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Reduzir movimento
            </span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.highContrast}
            onChange={toggleHighContrast}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Alto contraste
            </span>
          </div>
        </label>
      </div>

      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>Estas opções ajudam a tornar a aplicação mais acessível para utilizadores com necessidades especiais.</p>
      </div>
    </div>
  );
};