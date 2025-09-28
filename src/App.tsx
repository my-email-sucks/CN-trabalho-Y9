import React from 'react';
import { MapaDoCorpo } from './components/MapaDoCorpo';
import { BarraLateralHábitos } from './components/BarraLateralHábitos';
import { Medidores } from './components/Medidores';
import { VistaDoÓrgão } from './components/VistaDoÓrgão';
import { AlternadorComparar } from './components/AlternadorComparar';
import { BotãoExportar } from './components/BotãoExportar';
import { ConfiguracaoAcessibilidade } from './components/ConfiguracaoAcessibilidade';
import { PerfilUtilizador } from './components/PerfilUtilizador';
import { useAtlasStore } from './store/useAtlasStore';

function App() {
  const { accessibility } = useAtlasStore();

  return (
    <div
      className={`min-h-screen bg-gray-100 ${
        accessibility.highContrast ? 'contrast-more' : ''
      } ${accessibility.reduceMotion ? 'motion-reduce' : ''}`}
      id="atlas-main-content"
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Os teus hábitos</h1>
              <p className="text-sm text-gray-600 mt-1">
                Vê o que os maus hábitos fazem ao teu corpo
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <BotãoExportar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Habits */}
          <div className="lg:col-span-1">
            <BarraLateralHábitos />
          </div>

          {/* Center - Body Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Estado do corpo</h2>
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-700">Obesidade</span>
                </div>
              </div>
              <MapaDoCorpo />
            </div>
          </div>

          {/* Right Sidebar - Meters and Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Medidores />
            <PerfilUtilizador />
            <AlternadorComparar />
            <ConfiguracaoAcessibilidade />
          </div>
        </div>
      </div>

      {/* Organ Detail Modal */}
      <VistaDoÓrgão />

      {/* Footer */}
      <footer className="mt-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Atlas de Hábitos</strong> - Uma ferramenta educativa para consciencialização sobre saúde
            </p>
            <p>
              Esta aplicação destina-se apenas a fins educativos. Consulta sempre um profissional de saúde 
              qualificado para orientação médica personalizada.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;