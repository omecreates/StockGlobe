import { create } from "zustand";

interface GlobeState {
  heatmapMode: boolean;
  setHeatmapMode: (mode: boolean) => void;
  selectedMarkets: string[];
  toggleMarketSelection: (marketCode: string) => void;
  clearSelection: () => void;
}

export const useGlobeStore = create<GlobeState>((set) => ({
  heatmapMode: false,
  setHeatmapMode: (mode) => set({ heatmapMode: mode }),
  selectedMarkets: [],
  toggleMarketSelection: (marketCode) =>
    set((state) => {
      const isSelected = state.selectedMarkets.includes(marketCode);
      if (isSelected) {
        return { selectedMarkets: state.selectedMarkets.filter((c) => c !== marketCode) };
      }
      // Allow up to 2 selections for comparison
      if (state.selectedMarkets.length >= 2) {
        return { selectedMarkets: [state.selectedMarkets[1], marketCode] };
      }
      return { selectedMarkets: [...state.selectedMarkets, marketCode] };
    }),
  clearSelection: () => set({ selectedMarkets: [] }),
}));
