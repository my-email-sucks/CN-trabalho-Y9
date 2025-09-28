import React, { useState } from 'react';
import { Download, Camera, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export const BotãoExportar: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setShowModal(true);

      // Wait a bit for the modal to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = document.getElementById('atlas-main-content');
      if (!element) {
        throw new Error('Elemento não encontrado');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `atlas-de-habitos-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar a imagem. Tenta novamente.');
    } finally {
      setIsExporting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
      >
        {isExporting ? (
          <Camera className="w-4 h-4 animate-pulse" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{isExporting ? 'A exportar...' : 'Exportar'}</span>
      </button>

      {/* Export Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Exportar</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-700">
                  A capturar a imagem do teu Atlas de Hábitos...
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {isExporting ? 'A processar...' : 'Guardar como imagem'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};