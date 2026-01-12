<script setup lang="ts">
import { computed } from "vue";
import { useLootStore } from "@/stores/lootStore";
import { UNIQUE_ITEMS } from "@/data/dropRates";
import ItemTooltip from "./ItemTooltip.vue";

const store = useLootStore();

const images: Record<string, string> = {
  cloth: "/src/assets/images/mokhaiotl_cloth.png",
  eye: "/src/assets/images/eye_of_ayak.png",
  treads: "/src/assets/images/avernic_treads.png",
  pet: "/src/assets/images/dom.png",
};

const collectionItems = computed(() =>
  UNIQUE_ITEMS.map((item) => ({
    ...item,
    image: images[item.id],
    count: store.uniqueCounts[item.id] || 0,
    obtained: (store.uniqueCounts[item.id] || 0) > 0,
    unlocked: item.unlocksAt <= store.maxDelveLevel,
    rolls: store.uniqueObtainedAtRolls[item.id] || [],
  }))
);

const obtainedCount = computed(
  () => collectionItems.value.filter((i) => i.obtained).length
);
</script>

<template>
  <div class="relative">
    <div class="card-border"></div>
    <div class="bg-linear-to-b from-varla-bg-light to-varla-bg-medium rounded p-4">
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="header-line flex-1"></div>
        <h3 class="font-cinzel text-[0.85rem] font-semibold text-varla-gold-dark uppercase tracking-widest whitespace-nowrap">
          Collection Log
        </h3>
        <div class="flex items-center gap-2 pl-3 border-l border-varla-brown">
          <span class="text-sm font-semibold text-varla-gold tabular-nums">
            {{ obtainedCount }}/{{ UNIQUE_ITEMS.length }}
          </span>
        </div>
        <div class="header-line header-line-right flex-1"></div>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <ItemTooltip
          v-for="item in collectionItems"
          :key="item.id"
          :name="item.name"
          :subtitle="`Unlocks at Delve ${item.unlocksAt}`"
          :image="item.image"
          :count="item.obtained ? item.count : undefined"
          :rolls="item.obtained ? item.rolls : undefined"
        >
          <div
            class="flex flex-col items-center gap-2 cursor-default"
            :class="{
              'obtained': item.obtained,
              'locked': !item.unlocked
            }"
          >
            <div
              class="slot-frame p-1 rounded transition-all duration-200"
              :class="{
                'slot-frame-obtained': item.obtained,
                'slot-frame-locked': !item.unlocked,
                'slot-frame-default': !item.obtained && item.unlocked
              }"
            >
              <div
                class="slot-inner relative w-14 h-14 bg-varla-bg-dark rounded-sm flex items-center justify-center transition-all duration-200"
                :class="{
                  'opacity-40': !item.obtained,
                  'opacity-25': !item.unlocked
                }"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-10 h-10 object-contain pixelated"
                  :class="{ 'grayscale brightness-70': !item.obtained }"
                />
                <span
                  v-if="item.obtained && item.count > 1"
                  class="absolute bottom-0.5 right-1 text-[0.7rem] font-bold text-rare-yellow text-outline tabular-nums"
                >
                  {{ item.count }}
                </span>
                <div
                  v-if="!item.unlocked"
                  class="absolute inset-0 flex items-center justify-center bg-varla-bg-dark/70 rounded-sm text-varla-text-muted"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <span
              class="text-[0.65rem] text-center max-w-[70px] leading-tight transition-colors duration-200"
              :class="{
                'text-rare-orange-light': item.obtained,
                'text-varla-text-muted': !item.obtained
              }"
            >
              {{ item.name }}
            </span>
          </div>
        </ItemTooltip>
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

.slot-frame-default {
  background: linear-gradient(135deg, var(--color-varla-brown) 0%, var(--color-varla-brown-light) 100%);
}

.slot-frame-obtained {
  background: linear-gradient(135deg, var(--color-rare-orange) 0%, #b85a18 100%);
  box-shadow: 0 0 12px rgba(255, 140, 50, 0.35);
}

.slot-frame-obtained:hover {
  box-shadow: 0 0 20px rgba(255, 160, 60, 0.5);
}

.slot-frame-locked {
  background: var(--color-varla-bg-medium);
}

.obtained:hover .slot-inner {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
</style>
