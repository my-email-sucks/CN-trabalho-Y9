import React from 'react';
import { Heart, Brain, Activity, Shield, Zap, Smile, TrendingUp, Clock, Users, Dumbbell, AlertTriangle, Star } from 'lucide-react';
import { useAtlasStore } from '../store/useAtlasStore';

export const Medidores: React.FC = () => {
  const { meters, accessibility } = useAtlasStore();

  const CircularMeter: React.FC<{
    value: number;
    max: number;
    label: string;
    color: string;
    icon?: React.ReactNode;
  }> = ({ value, max, label, color, icon }) => {
    const percentage = (value / max) * 100;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-20 h-20">
          <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={color}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ${accessibility.reduceMotion ? '' : 'ease-out'}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {icon && <div className="flex justify-center mb-1">{icon}</div>}
              <span className="text-lg font-bold text-gray-900">
                {Math.round(value)}
              </span>
            </div>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 text-center">
          {label}
        </span>
      </div>
    );
  };

  const LinearMeter: React.FC<{
    value: number;
    max: number;
    label: string;
    color: string;
    icon?: React.ReactNode;
  }> = ({ value, max, label, color, icon }) => {
    const percentage = (value / max) * 100;

    return (
      <div className="flex items-center space-x-3">
        {icon && <div className="text-gray-600">{icon}</div>}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm text-gray-600">
              {value.toFixed(1)}/{max}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                accessibility.reduceMotion ? '' : 'ease-out'
              }`}
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#eab308';
    if (value >= 40) return '#f97316';
    return '#ef4444';
  };

  const getStatColor = (value: number, max: number, inverted = false) => {
    const percentage = value / max;
    if (inverted) {
      // For stats like stress and inflammation, lower is better
      if (percentage <= 0.3) return '#22c55e';
      if (percentage <= 0.5) return '#eab308';
      if (percentage <= 0.7) return '#f97316';
      return '#ef4444';
    } else {
      // For stats like sleep quality and recovery, higher is better
      if (percentage >= 0.7) return '#22c55e';
      if (percentage >= 0.5) return '#eab308';
      if (percentage >= 0.3) return '#f97316';
      return '#ef4444';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Ver por dentro</h3>
        <div className="text-sm text-gray-500">(Fígado)</div>
      </div>
      
      {/* Liver Detail Section */}
      <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center mb-3">
          <div className="w-16 h-12 bg-orange-400 rounded mr-4"></div>
          <div>
            <h4 className="font-semibold text-gray-900">Esteatose</h4>
            <p className="text-sm text-gray-600">Acumulação de gordura nas células hepáticas.</p>
          </div>
        </div>
      </div>

      {/* What Helps Section */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">O que ajuda</h4>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <span className="w-4 h-4 bg-blue-100 rounded-full mr-3 flex items-center justify-center">
              <span className="text-xs">2</span>
            </span>
            Exercício físico
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="w-4 h-4 bg-blue-100 rounded-full mr-3 flex items-center justify-center">
              <span className="text-xs">1</span>
            </span>
            Alimentação saudável
          </div>
        </div>
      </div>

      {/* Primary Health Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <CircularMeter
          value={meters.health}
          max={100}
          label="Saúde Geral"
          color={getHealthColor(meters.health)}
          icon={<Activity className="w-3 h-3 text-gray-600" />}
        />
        <CircularMeter
          value={meters.happiness}
          max={100}
          label="Felicidade"
          color={getHealthColor(meters.happiness)}
          icon={<Smile className="w-3 h-3 text-gray-600" />}
        />
      </div>

      {/* Secondary Health Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <CircularMeter
          value={meters.qualityOfLife}
          max={100}
          label="Qualidade de Vida"
          color={getHealthColor(meters.qualityOfLife)}
          icon={<Star className="w-3 h-3 text-gray-600" />}
        />
        <CircularMeter
          value={meters.mentalHealth}
          max={100}
          label="Saúde Mental"
          color={getHealthColor(meters.mentalHealth)}
          icon={<Brain className="w-3 h-3 text-gray-600" />}
        />
      </div>


      {/* Life Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">
              {Math.round(meters.lifeExpectancy)}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700">
            Esperança de Vida
          </span>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">
              {Math.round(meters.diseaseRisk)}%
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700">
            Risco de Doença
          </span>
        </div>
      </div>

      {/* Fitness and Wellness */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <CircularMeter
          value={meters.physicalFitness}
          max={100}
          label="Forma Física"
          color={getHealthColor(meters.physicalFitness)}
          icon={<Dumbbell className="w-3 h-3 text-gray-600" />}
        />
        <CircularMeter
          value={meters.overallWellness}
          max={100}
          label="Bem-estar Geral"
          color={getHealthColor(meters.overallWellness)}
          icon={<Heart className="w-3 h-3 text-gray-600" />}
        />
      </div>

      {/* Life Metrics */}
      {/* Detailed Stats */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 border-t pt-4">Métricas Detalhadas</h4>
        
        <LinearMeter
          value={meters.stats.cardioStrain}
          max={10}
          label="Tensão Cardíaca"
          color={getStatColor(meters.stats.cardioStrain, 10, true)}
          icon={<Heart className="w-4 h-4" />}
        />
        
        <LinearMeter
          value={meters.stats.inflammation}
          max={10}
          label="Inflamação"
          color={getStatColor(meters.stats.inflammation, 10, true)}
          icon={<Activity className="w-4 h-4" />}
        />
        
        <LinearMeter
          value={meters.stats.sleepQuality}
          max={10}
          label="Qualidade do Sono"
          color={getStatColor(meters.stats.sleepQuality, 10)}
          icon={<Brain className="w-4 h-4" />}
        />
        
        <LinearMeter
          value={meters.stats.stressLoad}
          max={10}
          label="Carga de Stress"
          color={getStatColor(meters.stats.stressLoad, 10, true)}
          icon={<Zap className="w-4 h-4" />}
        />
        
        <LinearMeter
          value={meters.stats.recoveryCapacity}
          max={10}
          label="Capacidade de Recuperação"
          color={getStatColor(meters.stats.recoveryCapacity, 10)}
          icon={<Shield className="w-4 h-4" />}
        />
        
        <LinearMeter
          value={meters.stats.cognitiveFunction}
          max={10}
          label="Função Cognitiva"
          color={getStatColor(meters.stats.cognitiveFunction, 10)}
          icon={<Brain className="w-4 h-4" />}
        />
        
        <LinearMeter
          value={meters.stats.immuneSystem}
          max={10}
          label="Sistema Imunitário"
          color={getStatColor(meters.stats.immuneSystem, 10)}
          icon={<Shield className="w-4 h-4" />}
        />
        
        <LinearMeter
          value={meters.stats.metabolicHealth}
          max={10}
          label="Saúde Metabólica"
          color={getStatColor(meters.stats.metabolicHealth, 10)}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};