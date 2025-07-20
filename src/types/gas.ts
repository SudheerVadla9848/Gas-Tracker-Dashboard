export interface GasData {
  baseFee: number;
  priorityFee: number;
  gasPrice: number;
  timestamp: number;
}

export interface GasPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ChainData {
  name: string;
  symbol: string;
  rpcUrl: string;
  gasData: GasData;
  history: GasPoint[];
  isConnected: boolean;
  color: string;
}

export interface SimulationResult {
  chain: string;
  gasCostETH: number;
  gasCostUSD: number;
  totalCostUSD: number;
}

export interface AppState {
  mode: 'live' | 'simulation';
  ethPrice: number;
  simulationAmount: number;
  chains: {
    ethereum: ChainData;
    polygon: ChainData;
    arbitrum: ChainData;
  };
  simulationResults: SimulationResult[];
  isLoading: boolean;
  error: string | null;
}