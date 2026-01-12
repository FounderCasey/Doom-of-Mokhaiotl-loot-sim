import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  UNIQUE_ITEMS,
  DEMON_TEAR_PRICE,
  getTotalTearsForRun,
} from "@/data/dropRates";

export interface LootDrop {
  itemId: string;
  itemName: string;
  delveLevel: number;
  runNumber: number;
}

export interface RunResult {
  runNumber: number;
  maxDelve: number;
  demonTears: number;
  uniqueDrops: LootDrop[];
  gpValue: number;
}

export const useLootStore = defineStore("loot", () => {
  // Settings
  const maxDelveLevel = ref(9);
  const runsToSimulate = ref(100);
  const simulationSpeed = ref<"instant" | "fast" | "normal" | "slow">("fast");

  // Simulation state
  const isSimulating = ref(false);
  const currentRun = ref(0);

  // Results
  const totalRuns = ref(0);
  const uniqueCounts = ref<Record<string, number>>({
    cloth: 0,
    eye: 0,
    treads: 0,
    pet: 0,
  });
  const totalDemonTears = ref(0);
  const runHistory = ref<RunResult[]>([]);
  const longestDryStreak = ref(0);
  const currentDryStreak = ref(0);

  // Computed values
  const totalGP = computed(() => {
    let gp = totalDemonTears.value * DEMON_TEAR_PRICE;
    for (const item of UNIQUE_ITEMS) {
      gp += (uniqueCounts.value[item.id] || 0) * item.price;
    }
    return gp;
  });

  const gpPerRun = computed(() => {
    if (totalRuns.value === 0) return 0;
    return Math.floor(totalGP.value / totalRuns.value);
  });

  const totalUniques = computed(() => {
    return Object.values(uniqueCounts.value).reduce((sum, count) => sum + count, 0);
  });

  // Actions
  function addRunResult(result: RunResult) {
    totalRuns.value++;
    totalDemonTears.value += result.demonTears;

    if (result.uniqueDrops.length > 0) {
      for (const drop of result.uniqueDrops) {
        uniqueCounts.value[drop.itemId] = (uniqueCounts.value[drop.itemId] || 0) + 1;
      }
      // Reset dry streak on unique drop
      if (currentDryStreak.value > longestDryStreak.value) {
        longestDryStreak.value = currentDryStreak.value;
      }
      currentDryStreak.value = 0;
    } else {
      currentDryStreak.value++;
    }

    // Keep only last 500 runs in history for performance
    runHistory.value.push(result);
    if (runHistory.value.length > 500) {
      runHistory.value.shift();
    }
  }

  function reset() {
    totalRuns.value = 0;
    uniqueCounts.value = { cloth: 0, eye: 0, treads: 0, pet: 0 };
    totalDemonTears.value = 0;
    runHistory.value = [];
    longestDryStreak.value = 0;
    currentDryStreak.value = 0;
    currentRun.value = 0;
    isSimulating.value = false;
  }

  function setSimulating(value: boolean) {
    isSimulating.value = value;
  }

  function setCurrentRun(value: number) {
    currentRun.value = value;
  }

  return {
    // Settings
    maxDelveLevel,
    runsToSimulate,
    simulationSpeed,
    // State
    isSimulating,
    currentRun,
    // Results
    totalRuns,
    uniqueCounts,
    totalDemonTears,
    runHistory,
    longestDryStreak,
    currentDryStreak,
    // Computed
    totalGP,
    gpPerRun,
    totalUniques,
    // Actions
    addRunResult,
    reset,
    setSimulating,
    setCurrentRun,
  };
});
