<script setup lang="ts">
import { useLootStore } from "@/stores/lootStore";
import ItemTooltip from "./ItemTooltip.vue";

const store = useLootStore();

function formatCount(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Last Roll -->
    <div class="relative">
      <div class="card-border" :class="{ 'card-border-unique': store.lastRollLoot.some(l => l.isUnique) }"></div>
      <div class="bg-linear-to-b from-varla-bg-light to-varla-bg-medium rounded p-4">
        <div class="flex items-center justify-center gap-3 mb-3.5">
          <div class="header-line flex-1"></div>
          <h3 class="font-cinzel text-[0.85rem] font-semibold text-varla-gold-dark uppercase tracking-widest whitespace-nowrap">
            Last Roll
          </h3>
          <div class="header-line header-line-right flex-1"></div>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-14 content-start">
          <div v-if="store.lastRollLoot.length === 0" class="w-full flex items-center justify-center py-6 text-varla-text-muted text-sm italic">
            Roll to see loot
          </div>
          <ItemTooltip
            v-for="item in store.lastRollLoot"
            :key="item.id"
            :name="item.name"
            :image="item.image"
          >
            <div
              class="loot-item relative w-11 h-11 bg-varla-bg-dark border border-varla-brown rounded-sm flex items-center justify-center cursor-default transition-all duration-200 hover:border-varla-brown-light hover:-translate-y-0.5 hover:shadow-lg"
              :class="{ 'loot-item-unique': item.isUnique }"
            >
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-8 h-8 object-contain pixelated" />
              <span v-else class="text-xs text-varla-text-muted font-semibold">{{ item.name.charAt(0) }}</span>
              <span class="absolute bottom-0.5 right-1 text-[0.6rem] font-bold text-varla-gold text-outline tabular-nums">
                {{ formatCount(item.count) }}
              </span>
            </div>
          </ItemTooltip>
        </div>
      </div>
    </div>

    <!-- Accumulated Loot -->
    <div class="relative">
      <div class="card-border"></div>
      <div class="bg-linear-to-b from-varla-bg-light to-varla-bg-medium rounded p-4">
        <div class="flex items-center justify-center gap-3 mb-3.5">
          <div class="header-line flex-1"></div>
          <h3 class="font-cinzel text-[0.85rem] font-semibold text-varla-gold-dark uppercase tracking-widest whitespace-nowrap">
            Total Loot
          </h3>
          <span class="text-xs text-varla-text-muted tabular-nums whitespace-nowrap px-2 border-l border-varla-brown">
            {{ store.totalRuns.toLocaleString() }} rolls
          </span>
          <div class="header-line header-line-right flex-1"></div>
        </div>
        <div class="flex flex-wrap gap-1.5 min-h-14 content-start max-h-[200px] overflow-y-auto pr-1">
          <div v-if="store.accumulatedLoot.length === 0" class="w-full flex items-center justify-center py-6 text-varla-text-muted text-sm italic">
            No loot yet
          </div>
          <ItemTooltip
            v-for="item in store.accumulatedLoot"
            :key="item.id"
            :name="item.name"
            :image="item.image"
            :count="item.isUnique ? item.count : undefined"
            :rolls="item.isUnique ? store.uniqueObtainedAtRolls[item.id] : undefined"
          >
            <div
              class="loot-item relative w-11 h-11 bg-varla-bg-dark border border-varla-brown rounded-sm flex items-center justify-center cursor-default transition-all duration-200 hover:border-varla-brown-light hover:-translate-y-0.5 hover:shadow-lg"
              :class="{ 'loot-item-unique': item.isUnique }"
            >
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-8 h-8 object-contain pixelated" />
              <span v-else class="text-xs text-varla-text-muted font-semibold">{{ item.name.charAt(0) }}</span>
              <span class="absolute bottom-0.5 right-1 text-[0.6rem] font-bold text-varla-gold text-outline tabular-nums">
                {{ formatCount(item.count) }}
              </span>
            </div>
          </ItemTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-varla-brown-light));
}

.header-line-right {
  background: linear-gradient(90deg, var(--color-varla-brown-light), transparent);
}

.loot-item-unique {
  border-color: var(--color-rare-orange) !important;
  background: linear-gradient(135deg, var(--color-varla-bg-dark) 0%, rgba(255, 140, 50, 0.15) 100%);
  box-shadow: 0 0 10px rgba(255, 140, 50, 0.5);
  animation: unique-glow 2s ease-in-out infinite;
}

.loot-item-unique:hover {
  border-color: var(--color-rare-orange-light) !important;
  box-shadow: 0 0 24px rgba(255, 160, 60, 0.7);
}
</style>
