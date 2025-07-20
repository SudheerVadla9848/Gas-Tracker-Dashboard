import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppState, ChainData, GasData, GasPoint, SimulationResult } from '../types/gas';
import { CHAIN_CONFIG } from '../config/chains';

const initialChainData = (name: string, symbol: string, rpcUrl: string, color: string): ChainData => ({
  name,
  symbol,
  rpcUrl,
  gasData: {
    baseFee: 0,
    priorityFee: 0,
    gasPrice: 0,
    timestamp: Date.now(),
  },
  history: [],
  isConnected: false,
  color,
});

interface GasStore extends AppState {
  setMode: (mode: 'live' | 'simulation') => void;
  setSimulationAmount: (amount: number) => void;
  setEthPrice: (price: number) => void;
  updateChainGasData: (chain: keyof AppState['chains'], gasData: GasData) => void;
  addGasHistoryPoint: (chain: keyof AppState['chains'], point: GasPoint) => void;
  setChainConnection: (chain: keyof AppState['chains'], connected: boolean) => void;
  calculateSimulation: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useGasStore = create<GasStore>()(
  subscribeWithSelector((set, get) => ({
    mode: 'live',
    ethPrice: 0,
    simulationAmount: 0.1,
    chains: {
      ethereum: initialChainData(
        CHAIN_CONFIG.ethereum.name,
        CHAIN_CONFIG.ethereum.symbol,
        CHAIN_CONFIG.ethereum.rpcUrl,
        CHAIN_CONFIG.ethereum.color
      ),
      polygon: initialChainData(
        CHAIN_CONFIG.polygon.name,
        CHAIN_CONFIG.polygon.symbol,
        CHAIN_CONFIG.polygon.rpcUrl,
        CHAIN_CONFIG.polygon.color
      ),
      arbitrum: initialChainData(
        CHAIN_CONFIG.arbitrum.name,
        CHAIN_CONFIG.arbitrum.symbol,
        CHAIN_CONFIG.arbitrum.rpcUrl,
        CHAIN_CONFIG.arbitrum.color
      ),
    },
    simulationResults: [],
    isLoading: false,
    error: null,

    setMode: (mode) => set({ mode }),
    setSimulationAmount: (amount) => set({ simulationAmount: amount }),
    setEthPrice: (price) => set({ ethPrice: price }),
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ isLoading: loading }),

    updateChainGasData: (chain, gasData) =>
      set((state) => ({
        chains: {
          ...state.chains,
          [chain]: {
            ...state.chains[chain],
            gasData,
          },
        },
      })),

    addGasHistoryPoint: (chain, point) =>
      set((state) => ({
        chains: {
          ...state.chains,
          [chain]: {
            ...state.chains[chain],
            history: (() => {
              const currentHistory = state.chains[chain].history.slice(-99);
              const lastPoint = currentHistory[currentHistory.length - 1];
              
              // Ensure timestamp is strictly greater than the last point
              const adjustedPoint = lastPoint && point.time <= lastPoint.time
                ? { ...point, time: lastPoint.time + 1000 } // Add 1 second (1000ms)
                : point;
              
              return [...currentHistory, adjustedPoint];
            })(),
          },
        },
      })),

    setChainConnection: (chain, connected) =>
      set((state) => ({
        chains: {
          ...state.chains,
          [chain]: {
            ...state.chains[chain],
            isConnected: connected,
          },
        },
      })),

    calculateSimulation: () => {
      const state = get();
      const results: SimulationResult[] = [];

      Object.entries(state.chains).forEach(([chainKey, chainData]) => {
        const gasCostETH = (chainData.gasData.baseFee + chainData.gasData.priorityFee) * 21000 / 1e9;
        const gasCostUSD = gasCostETH * state.ethPrice;
        const totalCostUSD = gasCostUSD + (state.simulationAmount * state.ethPrice);

        results.push({
          chain: chainData.name,
          gasCostETH,
          gasCostUSD,
          totalCostUSD,
        });
      });

      set({ simulationResults: results });
    },
  }))
);