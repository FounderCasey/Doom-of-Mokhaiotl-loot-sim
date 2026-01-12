import { ref, computed } from "vue";
import { useLootStore, type RunResult, type LootDrop } from "@/stores/lootStore";
import {
  DROP_RATES,
  DEMON_TEARS,
  UNIQUE_ITEMS,
  DEMON_TEAR_PRICE,
  getTotalTearsForRun,
} from "@/data/dropRates";

const SPEED_DELAYS: Record<string, number> = {
  instant: 0,
  fast: 10,
  normal: 100,
  slow: 500,
};

export function useSimulation() {
  const store = useLootStore();
  const abortController = ref<AbortController | null>(null);

  // Roll for a single unique drop at a specific delve level
  function rollForUnique(
    itemId: string,
    delveLevel: number,
    runNumber: number
  ): LootDrop | null {
    const normalizedLevel = Math.min(delveLevel, 9);
    const rates = DROP_RATES[normalizedLevel];
    const dropRate = rates[itemId as keyof typeof rates];

    if (dropRate === null) return null;

    const roll = Math.random();
    if (roll < 1 / dropRate) {
      const item = UNIQUE_ITEMS.find((i) => i.id === itemId);
      return {
        itemId,
        itemName: item?.name || itemId,
        delveLevel,
        runNumber,
      };
    }
    return null;
  }

  // Simulate a single run (all delves from 1 to maxDelve)
  function simulateRun(maxDelve: number, runNumber: number): RunResult {
    const uniqueDrops: LootDrop[] = [];
    let totalTears = 0;

    // Roll at each delve level
    for (let level = 1; level <= maxDelve; level++) {
      const normalizedLevel = Math.min(level, 9);

      // Add demon tears for this level
      totalTears += DEMON_TEARS[normalizedLevel];

      // Roll for each unique item
      for (const item of UNIQUE_ITEMS) {
        const drop = rollForUnique(item.id, level, runNumber);
        if (drop) {
          uniqueDrops.push(drop);
        }
      }
    }

    // Calculate GP value
    let gpValue = totalTears * DEMON_TEAR_PRICE;
    for (const drop of uniqueDrops) {
      const item = UNIQUE_ITEMS.find((i) => i.id === drop.itemId);
      if (item) {
        gpValue += item.price;
      }
    }

    return {
      runNumber,
      maxDelve,
      demonTears: totalTears,
      uniqueDrops,
      gpValue,
    };
  }

  // Run the full simulation
  async function runSimulation() {
    if (store.isSimulating) return;

    abortController.value = new AbortController();
    store.setSimulating(true);

    const maxDelve = store.maxDelveLevel;
    const totalRuns = store.runsToSimulate;
    const delay = SPEED_DELAYS[store.simulationSpeed];

    try {
      for (let i = 1; i <= totalRuns; i++) {
        if (abortController.value.signal.aborted) break;

        store.setCurrentRun(i);
        const result = simulateRun(maxDelve, store.totalRuns + 1);
        store.addRunResult(result);

        // Add delay for visual effect (except instant mode)
        if (delay > 0 && i < totalRuns) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // Yield to UI every 100 runs in instant mode
        if (delay === 0 && i % 100 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    } finally {
      store.setSimulating(false);
      store.setCurrentRun(0);
      abortController.value = null;
    }
  }

  // Stop the simulation
  function stopSimulation() {
    if (abortController.value) {
      abortController.value.abort();
    }
  }

  // Calculate probability of getting at least one unique after X runs
  function calculateProbability(
    itemId: string,
    maxDelve: number,
    runs: number
  ): number {
    // Calculate combined chance per run (rolling at each delve level)
    let noDropChance = 1;

    for (let level = 1; level <= maxDelve; level++) {
      const normalizedLevel = Math.min(level, 9);
      const rates = DROP_RATES[normalizedLevel];
      const dropRate = rates[itemId as keyof typeof rates];

      if (dropRate !== null) {
        noDropChance *= 1 - 1 / dropRate;
      }
    }

    // Chance of NOT getting the drop after X runs
    const noDropAfterRuns = Math.pow(noDropChance, runs);

    // Return chance of getting at least one
    return 1 - noDropAfterRuns;
  }

  // Calculate expected number of runs for a drop
  function calculateExpectedRuns(itemId: string, maxDelve: number): number {
    let combinedChance = 0;

    for (let level = 1; level <= maxDelve; level++) {
      const normalizedLevel = Math.min(level, 9);
      const rates = DROP_RATES[normalizedLevel];
      const dropRate = rates[itemId as keyof typeof rates];

      if (dropRate !== null) {
        // Use inclusion-exclusion for combined probability
        combinedChance = combinedChance + (1 / dropRate) * (1 - combinedChance);
      }
    }

    if (combinedChance === 0) return Infinity;
    return Math.round(1 / combinedChance);
  }

  return {
    runSimulation,
    stopSimulation,
    calculateProbability,
    calculateExpectedRuns,
    simulateRun,
  };
}
