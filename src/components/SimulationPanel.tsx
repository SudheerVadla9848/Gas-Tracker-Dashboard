import React from 'react';
import { Calculator, DollarSign, Fuel } from 'lucide-react';
import { useGasStore } from '../store/gasStore';

export const SimulationPanel: React.FC = () => {
  const {
    mode,
    setMode,
    simulationAmount,
    setSimulationAmount,
    simulationResults,
    calculateSimulation,
    ethPrice,
  } = useGasStore();

  const handleModeChange = (newMode: 'live' | 'simulation') => {
    setMode(newMode);
    if (newMode === 'simulation') {
      calculateSimulation();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    setSimulationAmount(amount);
    if (mode === 'simulation') {
      calculateSimulation();
    }
  };

  React.useEffect(() => {
    if (mode === 'simulation') {
      calculateSimulation();
    }
  }, [ethPrice, mode]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold text-white">Transaction Simulator</h2>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-900/50 rounded-lg p-1 mb-6">
        <button
          onClick={() => handleModeChange('live')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'live'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Live Mode
        </button>
        <button
          onClick={() => handleModeChange('simulation')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'simulation'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Simulation
        </button>
      </div>

      {mode === 'simulation' && (
        <>
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction Amount (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                value={simulationAmount}
                onChange={handleAmountChange}
                step="0.01"
                min="0"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.1"
              />
              <DollarSign size={16} className="absolute right-3 top-3.5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ETH Price: ${ethPrice.toFixed(2)}
            </p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Fuel size={18} className="mr-2" />
              Gas Cost Comparison
            </h3>
            
            {simulationResults.map((result) => (
              <div
                key={result.chain}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{result.chain}</h4>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Gas Cost</p>
                    <p className="text-white font-semibold">
                      ${result.gasCostUSD.toFixed(4)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Gas (ETH)</p>
                    <p className="text-white">{result.gasCostETH.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Gas (USD)</p>
                    <p className="text-white">${result.gasCostUSD.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total (USD)</p>
                    <p className="text-white font-semibold">${result.totalCostUSD.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'live' && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">Live Mode Active</div>
          <div className="text-sm text-gray-500">
            Real-time gas prices are being tracked across all chains
          </div>
        </div>
      )}
    </div>
  );
};