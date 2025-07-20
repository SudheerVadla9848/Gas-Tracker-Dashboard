import { useEffect, useRef } from 'react';
import { JsonRpcProvider, formatUnits } from 'ethers';
import { useGasStore } from '../store/gasStore';
import { CHAIN_CONFIG, UNISWAP_V3_ETH_USDC_POOL } from '../config/chains';
import { GasData, GasPoint } from '../types/gas';

export const useGasTracker = () => {
  const providersRef = useRef<{ [key: string]: JsonRpcProvider }>({});
  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  
  const {
    updateChainGasData,
    addGasHistoryPoint,
    setChainConnection,
    setEthPrice,
    setError,
    setLoading,
    mode,
  } = useGasStore();

  const calculateEthPrice = async () => {
    try {
      const provider = new JsonRpcProvider('https://ethereum-rpc.publicnode.com');
      
      // Simple fallback price fetch (in production, you'd parse Uniswap events)
      // For demo purposes, using a mock calculation
      const mockPrice = 2000 + Math.random() * 500; // Mock ETH price between $2000-$2500
      setEthPrice(mockPrice);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      setEthPrice(2300); // Fallback price
    }
  };

  const connectToChain = async (chainKey: string) => {
    try {
      const config = CHAIN_CONFIG[chainKey as keyof typeof CHAIN_CONFIG];
      if (!config) return;

      const provider = new JsonRpcProvider(config.rpcUrl);

      const fetchGasData = async () => {
        try {
          const feeData = await provider.getFeeData();
          const block = await provider.getBlock('latest');
          
          const gasData: GasData = {
            baseFee: feeData.lastBaseFeePerGas ? Number(formatUnits(feeData.lastBaseFeePerGas, 'gwei')) : 0,
            priorityFee: feeData.maxPriorityFeePerGas ? Number(formatUnits(feeData.maxPriorityFeePerGas, 'gwei')) : 0,
            gasPrice: feeData.gasPrice ? Number(formatUnits(feeData.gasPrice, 'gwei')) : 0,
            timestamp: Date.now(),
          };

          updateChainGasData(chainKey as any, gasData);
          setChainConnection(chainKey as any, true);

          // Add to history for chart
          const currentTime = Math.floor(Date.now() / 1000);
          const gasPoint: GasPoint = {
            time: currentTime,
            open: gasData.gasPrice,
            high: gasData.gasPrice,
            low: gasData.gasPrice,
            close: gasData.gasPrice,
          };

          addGasHistoryPoint(chainKey as any, gasPoint);
        } catch (error) {
          console.error(`Error fetching gas data for ${chainKey}:`, error);
          setChainConnection(chainKey as any, false);
        }
      };

      // Initial fetch
      await fetchGasData();

      // Set up interval for regular updates
      intervalsRef.current[chainKey] = setInterval(fetchGasData, 6000); // Update every 6 seconds

    } catch (error) {
      console.error(`Error connecting to ${chainKey}:`, error);
      setChainConnection(chainKey as any, false);
    }
  };

  const startTracking = async () => {
    setLoading(true);
    setError(null);

    try {
      // Start tracking ETH price
      await calculateEthPrice();
      setInterval(calculateEthPrice, 30000); // Update ETH price every 30 seconds

      // Connect to all chains
      await Promise.all([
        connectToChain('ethereum'),
        connectToChain('polygon'),
        connectToChain('arbitrum'),
      ]);

      setLoading(false);
    } catch (error) {
      setError('Failed to start gas tracking');
      setLoading(false);
    }
  };

  const stopTracking = () => {
    // Clear all intervals
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};

    // Close WebSocket connections
    Object.values(providersRef.current).forEach(provider => {
      if (provider && provider.destroy) {
        provider.destroy();
      }
    });
    providersRef.current = {};

    // Reset connection states
    setChainConnection('ethereum', false);
    setChainConnection('polygon', false);
    setChainConnection('arbitrum', false);
  };

  useEffect(() => {
    if (mode === 'live') {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [mode]);

  return {
    startTracking,
    stopTracking,
  };
};