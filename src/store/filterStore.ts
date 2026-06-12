import { create } from "zustand";
import { FilterState } from "@/types/stock";

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  toggleSector: (sector: string) => void;
  setSectors: (sectors: string[]) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setMarketCapRange: (min: number | null, max: number | null) => void;
  setVolumeRange: (min: number | null, max: number | null) => void;
  setPERange: (min: number | null, max: number | null) => void;
  setRSIRange: (min: number | null, max: number | null) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  search: "",
  sectors: [],
  priceMin: null,
  priceMax: null,
  marketCapMin: null,
  marketCapMax: null,
  volumeMin: null,
  volumeMax: null,
  peMin: null,
  peMax: null,
  rsiMin: null,
  rsiMax: null,
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...initialState,

  setSearch: (search) => set({ search }),

  toggleSector: (sector) => {
    const sectors = get().sectors;
    if (sectors.includes(sector)) {
      set({ sectors: sectors.filter((s) => s !== sector) });
    } else {
      set({ sectors: [...sectors, sector] });
    }
  },

  setSectors: (sectors) => set({ sectors }),

  setPriceRange: (priceMin, priceMax) => set({ priceMin, priceMax }),
  setMarketCapRange: (marketCapMin, marketCapMax) => set({ marketCapMin, marketCapMax }),
  setVolumeRange: (volumeMin, volumeMax) => set({ volumeMin, volumeMax }),
  setPERange: (peMin, peMax) => set({ peMin, peMax }),
  setRSIRange: (rsiMin, rsiMax) => set({ rsiMin, rsiMax }),

  resetFilters: () => set({ ...initialState }),
}));
