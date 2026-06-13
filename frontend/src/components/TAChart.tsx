import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from "lightweight-charts";
import { TADataPoint } from "@/lib/apiClient";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TAChartProps {
  data: TADataPoint[];
  support: number;
  resistance: number;
  ticker: string;
}

export function TAChart({ data, support, resistance, ticker }: TAChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  // Series refs
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdSignalSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdHistSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  
  // Moving averages
  const sma20Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const sma50Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const sma200Ref = useRef<ISeriesApi<"Line"> | null>(null);
  
  // Bollinger bands
  const bbUpperRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbLowerRef = useRef<ISeriesApi<"Line"> | null>(null);

  // Toggles
  const [showSMA, setShowSMA] = useState(true);
  const [showBB, setShowBB] = useState(false);
  const [showVolume, setShowVolume] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      autoSize: true,
    });
    chartRef.current = chart;

    // 1. Candlestick Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });
    candlestickSeriesRef.current = candlestickSeries;

    const candleData = data.map((d) => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candlestickSeries.setData(candleData);

    // Support and Resistance lines
    if (support > 0) {
      candlestickSeries.createPriceLine({
        price: support,
        color: "#22c55e",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: "Support",
      });
    }
    if (resistance > 0) {
      candlestickSeries.createPriceLine({
        price: resistance,
        color: "#ef4444",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: "Resistance",
      });
    }

    // 2. Volume Series
    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    chart.priceScale("").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    const volData = data.map((d) => ({
      time: d.time as Time,
      value: d.volume,
      color: d.close >= d.open ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
    }));
    volumeSeries.setData(volData);

    // 3. Moving Averages
    const sma20Data = data.filter((d) => d.sma20 !== null).map((d) => ({ time: d.time as Time, value: d.sma20! }));
    const sma50Data = data.filter((d) => d.sma50 !== null).map((d) => ({ time: d.time as Time, value: d.sma50! }));
    const sma200Data = data.filter((d) => d.sma200 !== null).map((d) => ({ time: d.time as Time, value: d.sma200! }));

    sma20Ref.current = chart.addLineSeries({ color: "#3b82f6", lineWidth: 2, title: "SMA 20" });
    sma50Ref.current = chart.addLineSeries({ color: "#eab308", lineWidth: 2, title: "SMA 50" });
    sma200Ref.current = chart.addLineSeries({ color: "#a855f7", lineWidth: 2, title: "SMA 200" });

    sma20Ref.current.setData(sma20Data);
    sma50Ref.current.setData(sma50Data);
    sma200Ref.current.setData(sma200Data);

    // 4. Bollinger Bands
    const bbUpperData = data.filter((d) => d.bb_upper !== null).map((d) => ({ time: d.time as Time, value: d.bb_upper! }));
    const bbLowerData = data.filter((d) => d.bb_lower !== null).map((d) => ({ time: d.time as Time, value: d.bb_lower! }));

    bbUpperRef.current = chart.addLineSeries({ color: "rgba(168, 85, 247, 0.5)", lineWidth: 1, title: "BB Upper" });
    bbLowerRef.current = chart.addLineSeries({ color: "rgba(168, 85, 247, 0.5)", lineWidth: 1, title: "BB Lower" });

    bbUpperRef.current.setData(bbUpperData);
    bbLowerRef.current.setData(bbLowerData);

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data, support, resistance]);

  // Handle toggles
  useEffect(() => {
    if (sma20Ref.current) sma20Ref.current.applyOptions({ visible: showSMA });
    if (sma50Ref.current) sma50Ref.current.applyOptions({ visible: showSMA });
    if (sma200Ref.current) sma200Ref.current.applyOptions({ visible: showSMA });
  }, [showSMA]);

  useEffect(() => {
    if (bbUpperRef.current) bbUpperRef.current.applyOptions({ visible: showBB });
    if (bbLowerRef.current) bbLowerRef.current.applyOptions({ visible: showBB });
  }, [showBB]);

  useEffect(() => {
    if (volumeSeriesRef.current) volumeSeriesRef.current.applyOptions({ visible: showVolume });
  }, [showVolume]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 glass p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <Switch id="show-sma" checked={showSMA} onCheckedChange={setShowSMA} />
          <Label htmlFor="show-sma" className="text-sm font-medium">Moving Averages</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="show-bb" checked={showBB} onCheckedChange={setShowBB} />
          <Label htmlFor="show-bb" className="text-sm font-medium">Bollinger Bands</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="show-volume" checked={showVolume} onCheckedChange={setShowVolume} />
          <Label htmlFor="show-volume" className="text-sm font-medium">Volume</Label>
        </div>
      </div>
      <div 
        ref={chartContainerRef} 
        className="w-full h-[500px] glass rounded-xl overflow-hidden p-1 border border-border" 
      />
    </div>
  );
}
