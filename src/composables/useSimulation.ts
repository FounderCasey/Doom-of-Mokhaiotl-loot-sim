import { ref } from "vue";
import { useLootStore, type LootDrop, type LootItem } from "@/stores/lootStore";
import { DROP_RATES, DEMON_TEARS, UNIQUE_ITEMS } from "@/data/dropRates";

const IMG = "/src/assets/images/";

// Common loot table based on actual Doom drops
const COMMON_LOOT = [
  { id: "gold_ore", name: "Gold Ore", image: IMG + "gold_ore.png", minQty: 50, maxQty: 150 },
  { id: "coal", name: "Coal", image: IMG + "coal.png", minQty: 100, maxQty: 300 },
  { id: "runite_ore", name: "Runite Ore", image: IMG + "runite_ore.png", minQty: 10, maxQty: 40 },
  { id: "death_rune", name: "Death Rune", image: IMG + "death_rune.png", minQty: 100, maxQty: 300 },
  { id: "chaos_rune", name: "Chaos Rune", image: IMG + "chaos_rune.png", minQty: 150, maxQty: 400 },
  { id: "fire_rune", name: "Fire Rune", image: IMG + "fire_rune.png", minQty: 200, maxQty: 500 },
  { id: "earth_rune", name: "Earth Rune", image: IMG + "earth_rune.png", minQty: 200, maxQty: 500 },
  { id: "raw_shark", name: "Raw Shark", image: IMG + "raw_shark.png", minQty: 20, maxQty: 60 },
  { id: "sun_kissed_bones", name: "Sun-kissed Bones", image: IMG + "sun-kissed_bones.png", minQty: 10, maxQty: 30 },
  { id: "ranarr_seed", name: "Ranarr Seed", image: IMG + "ranarr_seed.png", minQty: 2, maxQty: 6 },
  { id: "celastrus_seed", name: "Celastrus Seed", image: IMG + "celastrus_seed.png", minQty: 1, maxQty: 3 },
  { id: "spirit_seed", name: "Spirit Seed", image: IMG + "spirit_seed.png", minQty: 1, maxQty: 2 },
  { id: "dragon_dart_tip", name: "Dragon Dart Tip", image: IMG + "dragon_dart_tip.png", minQty: 20, maxQty: 50 },
  { id: "dragon_med_helm", name: "Dragon Med Helm", image: IMG + "dragon_med_helm.png", minQty: 1, maxQty: 1 },
  { id: "dragon_platelegs", name: "Dragon Platelegs", image: IMG + "dragon_platelegs.png", minQty: 1, maxQty: 1 },
  { id: "rune_pickaxe", name: "Rune Pickaxe", image: IMG + "rune_pickaxe.png", minQty: 1, maxQty: 1 },
  { id: "mystic_earth_staff", name: "Mystic Earth Staff", image: IMG + "mystic_earth_staff.png", minQty: 1, maxQty: 1 },
  { id: "onyx_bolts", name: "Onyx Bolts (e)", image: IMG + "onyx_bolts.png", minQty: 10, maxQty: 30 },
  { id: "steel_cannonball", name: "Steel Cannonball", image: IMG + "steel_cannonball.png", minQty: 100, maxQty: 300 },
  { id: "clue_elite", name: "Clue Scroll (elite)", image: IMG + "clue_scroll_(elite).png", minQty: 1, maxQty: 1 },
  { id: "aether_catalyst", name: "Aether Catalyst", image: IMG + "aether_catalyst.png", minQty: 1, maxQty: 3 },
  { id: "mokhaiotl_waystone", name: "Mokhaiotl Waystone", image: IMG + "mokhaiotl_waystone_5.png", minQty: 1, maxQty: 5 },
  { id: "shark_lure", name: "Shark Lure", image: IMG + "shark_lure.png", minQty: 1, maxQty: 3 },
  { id: "tooth_half", name: "Tooth Half of Key", image: IMG + "tooth_half_of_key_(moon_key).png", minQty: 1, maxQty: 1 },
];

export function useSimulation() {
  const store = useLootStore();
  const abortController = ref<AbortController | null>(null);

  function rollForUnique(itemId: string, delveLevel: number, runNumber: number): LootDrop | null {
    const normalizedLevel = Math.min(delveLevel, 9);
    const rates = DROP_RATES[normalizedLevel];
    const dropRate = rates[itemId as keyof typeof rates];

    if (dropRate === null) return null;

    if (Math.random() < 1 / dropRate) {
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

  function rollCommonLoot(delveLevel: number): LootItem[] {
    const loot: LootItem[] = [];
    const numDrops = Math.floor(Math.random() * 3) + 2 + Math.floor(delveLevel / 3);

    const availableLoot = [...COMMON_LOOT];
    for (let i = 0; i < Math.min(numDrops, availableLoot.length); i++) {
      const idx = Math.floor(Math.random() * availableLoot.length);
      const item = availableLoot.splice(idx, 1)[0];
      const qty = Math.floor(Math.random() * (item.maxQty - item.minQty + 1) + item.minQty);
      loot.push({
        id: item.id,
        name: item.name,
        count: qty,
        image: item.image,
      });
    }
    return loot;
  }

  function simulateRoll(maxDelve: number, runNumber: number) {
    const uniqueDrops: LootDrop[] = [];
    let totalTears = 0;

    // Roll at each delve level
    for (let level = 1; level <= maxDelve; level++) {
      const normalizedLevel = Math.min(level, 9);
      totalTears += DEMON_TEARS[normalizedLevel];

      for (const item of UNIQUE_ITEMS) {
        const drop = rollForUnique(item.id, level, runNumber);
        if (drop) uniqueDrops.push(drop);
      }
    }

    // Roll common loot
    const commonLoot = rollCommonLoot(maxDelve);

    // Add to store
    store.addRollResult(totalTears, uniqueDrops, commonLoot);
  }

  async function runSimulation(count?: number) {
    if (store.isSimulating) return;

    abortController.value = new AbortController();
    store.setSimulating(true);

    const maxDelve = store.maxDelveLevel;
    const totalRuns = count ?? store.runsToSimulate;
    const delay = store.rollInterval;

    try {
      for (let i = 1; i <= totalRuns; i++) {
        if (abortController.value.signal.aborted) break;

        store.setCurrentRun(i);
        simulateRoll(maxDelve, store.totalRuns + 1);

        if (delay > 0 && i < totalRuns) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

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

  function stopSimulation() {
    abortController.value?.abort();
  }

  function calculateProbability(itemId: string, maxDelve: number, runs: number): number {
    let noDropChance = 1;

    for (let level = 1; level <= maxDelve; level++) {
      const normalizedLevel = Math.min(level, 9);
      const rates = DROP_RATES[normalizedLevel];
      const dropRate = rates[itemId as keyof typeof rates];

      if (dropRate !== null) {
        noDropChance *= 1 - 1 / dropRate;
      }
    }

    return 1 - Math.pow(noDropChance, runs);
  }

  function calculateExpectedRuns(itemId: string, maxDelve: number): number {
    let combinedChance = 0;

    for (let level = 1; level <= maxDelve; level++) {
      const normalizedLevel = Math.min(level, 9);
      const rates = DROP_RATES[normalizedLevel];
      const dropRate = rates[itemId as keyof typeof rates];

      if (dropRate !== null) {
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
  };
}
