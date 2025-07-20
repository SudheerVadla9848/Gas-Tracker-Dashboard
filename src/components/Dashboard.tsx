import React from 'react';
import { Header } from './Header';
import { GasCard } from './GasCard';
import { GasChart } from './GasChart';
import { SimulationPanel } from './SimulationPanel';
import { useGasTracker } from '../hooks/useGasTracker';

export const Dashboard: React.FC = () => {
  useGasTracker();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gas Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GasCard chainKey="ethereum" />
              <GasCard chainKey="polygon" />
              <GasCard chainKey="arbitrum" />
            </div>

            {/* Charts Section */}
            <div className="space-y-8">
              <GasChart chainKey="ethereum" height={300} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GasChart chainKey="polygon" height={250} />
                <GasChart chainKey="arbitrum" height={250} />
              </div>
            </div>
          </div>

          {/* Simulation Panel */}
          <div className="lg:col-span-1">
            <SimulationPanel />
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-400">3</p>
              <p className="text-sm text-gray-400">Chains Monitored</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">6s</p>
              <p className="text-sm text-gray-400">Update Interval</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">Real-time</p>
              <p className="text-sm text-gray-400">Data Streaming</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">USD</p>
              <p className="text-sm text-gray-400">Cost Calculations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};