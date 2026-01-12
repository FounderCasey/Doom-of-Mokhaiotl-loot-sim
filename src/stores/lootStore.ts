import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { UNIQUE_ITEMS, DEMON_TEAR_PRICE } from "@/data/dropRates";

export interface LootDrop {
  itemId: string;
  itemName: string;
  delveLevel: number;
  runNumber: number;
}

export interface LootItem {
  id: string;
  name: string;
  count: number;
  image?: string;
  isUnique?: boolean;
}

export const useLootStore = defineStore("loot", () => {
  // Settings
  const maxDelveLevel = ref(9);
  const runsToSimulate = ref(100);
  const rollInterval = ref(100);

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

  // Track roll numbers when each unique was obtained
  const uniqueObtainedAtRolls = ref<Record<string, number[]>>({
    cloth: [],
    eye: [],
    treads: [],
    pet: [],
  });

  // Last roll loot display
  const lastRollLoot = ref<LootItem[]>([]);

  // Accumulated loot from all rolls
  const accumulatedLoot = ref<LootItem[]>([]);

  // Computed values
  const totalGP = computed(() => {
    let gp = totalDemonTears.value * DEMON_TEAR_PRICE;
    for (const item of UNIQUE_ITEMS) {
      gp += (uniqueCounts.value[item.id] || 0) * item.price;
    }
    return gp;
  });

  const totalUniques = computed(() => {
    return Object.values(uniqueCounts.value).reduce((sum, count) => sum + count, 0);
  });

  function getItemImage(itemId: string): string | null {
    const images: Record<string, string> = {
      cloth: "/src/assets/images/mokhaiotl_cloth.png",
      eye: "/src/assets/images/eye_of_ayak.png",
      treads: "/src/assets/images/avernic_treads.png",
      pet: "/src/assets/images/dom.png",
      demon_tears: "/src/assets/images/demon_tear.png",
    };
    return images[itemId] || null;
  }

  // Actions
  function addRollResult(
    demonTears: number,
    uniqueDrops: LootDrop[],
    commonLoot: LootItem[]
  ) {
    totalRuns.value++;
    totalDemonTears.value += demonTears;

    // Update unique counts and track roll numbers
    for (const drop of uniqueDrops) {
      uniqueCounts.value[drop.itemId] = (uniqueCounts.value[drop.itemId] || 0) + 1;
      if (!uniqueObtainedAtRolls.value[drop.itemId]) {
        uniqueObtainedAtRolls.value[drop.itemId] = [];
      }
      uniqueObtainedAtRolls.value[drop.itemId].push(totalRuns.value);
    }

    // Build last roll display
    lastRollLoot.value = [...commonLoot];

    // Add demon tears to display
    if (demonTears > 0) {
      lastRollLoot.value.push({
        id: "demon_tears",
        name: "Demon Tears",
        count: demonTears,
        image: getItemImage("demon_tears") || undefined,
      });
    }

    // Add unique drops to display
    for (const drop of uniqueDrops) {
      lastRollLoot.value.push({
        id: drop.itemId,
        name: drop.itemName,
        count: 1,
        image: getItemImage(drop.itemId) || undefined,
        isUnique: true,
      });
    }

    // Merge into accumulated loot
    for (const item of lastRollLoot.value) {
      const existing = accumulatedLoot.value.find((l) => l.id === item.id);
      if (existing) {
        existing.count += item.count;
      } else {
        accumulatedLoot.value.push({ ...item });
      }
    }
  }

  function reset() {
    totalRuns.value = 0;
    uniqueCounts.value = { cloth: 0, eye: 0, treads: 0, pet: 0 };
    uniqueObtainedAtRolls.value = { cloth: [], eye: [], treads: [], pet: [] };
    totalDemonTears.value = 0;
    lastRollLoot.value = [];
    accumulatedLoot.value = [];
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
    rollInterval,
    // State
    isSimulating,
    currentRun,
    // Results
    totalRuns,
    uniqueCounts,
    uniqueObtainedAtRolls,
    totalDemonTears,
    lastRollLoot,
    accumulatedLoot,
    // Computed
    totalGP,
    totalUniques,
    // Actions
    addRollResult,
    reset,
    setSimulating,
    setCurrentRun,
    getItemImage,
  };
});
