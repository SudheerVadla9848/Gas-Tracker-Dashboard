import React from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { useGasStore } from '../store/gasStore';

interface GasCardProps {
  chainKey: keyof ReturnType<typeof useGasStore>['chains'];
}

export const GasCard: React.FC<GasCardProps> = ({ chainKey }) => {
  const { chains } = useGasStore();
  const chainData = chains[chainKey];

  const formatGasPrice = (price: number) => {
    return price > 0 ? price.toFixed(2) : '—';
  };

  const getConnectionStatus = () => {
    return chainData.isConnected ? (
      <div className="flex items-center text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
        <span className="text-xs">Live</span>
      </div>
    ) : (
      <div className="flex items-center text-red-400">
        <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
        <span className="text-xs">Offline</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${chainData.color}20`, border: `2px solid ${chainData.color}` }}
          >
            <Zap size={20} style={{ color: chainData.color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{chainData.name}</h3>
            <p className="text-sm text-gray-400">{chainData.symbol}</p>
          </div>
        </div>
        {getConnectionStatus()}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Base Fee</p>
            <p className="text-lg font-bold text-white">
              {formatGasPrice(chainData.gasData.baseFee)} gwei
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Priority Fee</p>
            <p className="text-lg font-bold text-white">
              {formatGasPrice(chainData.gasData.priorityFee)} gwei
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Total Gas Price</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-white">
              {formatGasPrice(chainData.gasData.gasPrice)} gwei
            </p>
            <div className="flex items-center">
              {Math.random() > 0.5 ? (
                <TrendingUp size={16} className="text-green-400" />
              ) : (
                <TrendingDown size={16} className="text-red-400" />
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Last updated: {new Date(chainData.gasData.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};