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
  <div class="collection-card">
    <div class="card-border"></div>
    <div class="card-inner">
      <div class="card-header">
        <div class="header-line left"></div>
        <h3 class="card-title">Collection Log</h3>
        <div class="progress-indicator">
          <span class="progress-count">{{ obtainedCount }}/{{ UNIQUE_ITEMS.length }}</span>
        </div>
        <div class="header-line right"></div>
      </div>

      <div class="collection-grid">
        <ItemTooltip
          v-for="item in collectionItems"
          :key="item.id"
          :name="item.name"
          :subtitle="`Unlocks at Delve ${item.unlocksAt}`"
          :image="item.image"
          :count="item.obtained ? item.count : undefined"
          :rolls="item.obtained ? item.rolls : undefined"
        >
          <div class="collection-slot" :class="{ obtained: item.obtained, locked: !item.unlocked }">
            <div class="slot-frame">
              <div class="slot-inner">
                <img :src="item.image" :alt="item.name" class="item-img" />
                <span v-if="item.obtained && item.count > 1" class="item-count">{{ item.count }}</span>
                <div v-if="!item.unlocked" class="lock-overlay">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </ItemTooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collection-card {
  position: relative;
}

.card-border {
  position: absolute;
  inset: 0;
  border: 2px solid var(--varla-brown);
  border-radius: 4px;
  pointer-events: none;
}

.card-border::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid var(--varla-brown-light);
  border-radius: 2px;
}

.card-inner {
  background: linear-gradient(180deg, var(--varla-bg-light) 0%, var(--varla-bg-medium) 100%);
  border-radius: 4px;
  padding: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.header-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--varla-brown-light));
}

.header-line.right {
  background: linear-gradient(90deg, var(--varla-brown-light), transparent);
}

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--varla-gold-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--varla-brown);
}

.progress-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--varla-gold);
  font-variant-numeric: tabular-nums;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.collection-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
}

.slot-frame {
  position: relative;
  padding: 4px;
  background: linear-gradient(135deg, var(--varla-brown) 0%, var(--varla-brown-light) 100%);
  border-radius: 4px;
}

.slot-inner {
  position: relative;
  width: 56px;
  height: 56px;
  background: var(--varla-bg-dark);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.collection-slot:not(.locked):hover .slot-inner {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.collection-slot:not(.obtained) .slot-inner {
  opacity: 0.4;
}

.collection-slot:not(.obtained) .item-img {
  filter: grayscale(100%) brightness(0.7);
}

.collection-slot.obtained .slot-frame {
  background: linear-gradient(135deg, #e07020 0%, #b85a18 100%);
  box-shadow: 0 0 12px rgba(255, 140, 50, 0.35);
}

.collection-slot.obtained:hover .slot-frame {
  box-shadow: 0 0 20px rgba(255, 160, 60, 0.5);
}

.collection-slot.locked .slot-inner {
  opacity: 0.25;
}

.collection-slot.locked .slot-frame {
  background: var(--varla-bg-medium);
}

.item-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-count {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #ffcc00;
  text-shadow:
    1px 1px 0 var(--varla-bg-dark),
    -1px -1px 0 var(--varla-bg-dark),
    1px -1px 0 var(--varla-bg-dark),
    -1px 1px 0 var(--varla-bg-dark);
  font-variant-numeric: tabular-nums;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22, 16, 11, 0.7);
  border-radius: 2px;
  color: var(--varla-text-muted);
}

.item-name {
  font-size: 0.65rem;
  color: var(--varla-text-muted);
  text-align: center;
  max-width: 70px;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.collection-slot.obtained .item-name {
  color: #ff9040;
}

.collection-slot:hover .item-name {
  color: var(--varla-text);
}
</style>
