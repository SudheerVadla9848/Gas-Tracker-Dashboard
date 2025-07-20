import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { useGasStore } from '../store/gasStore';

interface GasChartProps {
  chainKey: keyof ReturnType<typeof useGasStore>['chains'];
  height?: number;
}

export const GasChart: React.FC<GasChartProps> = ({ chainKey, height = 300 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const { chains } = useGasStore();
  const chainData = chains[chainKey];

  // Combined chart and series creation effect - runs only once
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const containerWidth = container.clientWidth || 600;

    const chart = createChart(chartContainerRef.current, {
      width: containerWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Create initial candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: chainData.color,
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: chainData.color,
      wickDownColor: '#ef4444',
      wickUpColor: chainData.color,
    });

    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (seriesRef.current && chart) {
        chart.removeSeries(seriesRef.current);
        seriesRef.current = null;
      }
      chart.remove();
    };
  }, []); // Empty dependency array - create chart only once

  // Color update effect
  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        upColor: chainData.color,
        borderUpColor: chainData.color,
        wickUpColor: chainData.color,
      });
    }
  }, [chainData.color]);

  // Chart options update effect
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({ height });
    }
  }, [height]);

  // Data update effect
  useEffect(() => {
    if (seriesRef.current && chainData.history.length > 0) {
      const candlestickData: CandlestickData[] = chainData.history.map(point => ({
        time: point.time,
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close,
      }));

      seriesRef.current.setData(candlestickData);
    }
  }, [chainData.history]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{chainData.name} Gas Price</h3>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: chainData.color }}
          />
          <span className="text-sm text-gray-400">
            {chainData.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      <div 
        ref={chartContainerRef}
        className="w-full rounded-lg border border-gray-700 bg-gray-800/50"
        style={{ height }}
      />
    </div>
  );
};