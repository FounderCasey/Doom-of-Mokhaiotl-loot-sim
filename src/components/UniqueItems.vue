<script setup lang="ts">
import { computed } from "vue";
import { useLootStore } from "@/stores/lootStore";
import { UNIQUE_ITEMS } from "@/data/dropRates";

const store = useLootStore();

const items = computed(() =>
  UNIQUE_ITEMS.map((item) => ({
    ...item,
    count: store.uniqueCounts[item.id] || 0,
    unlocked: item.unlocksAt <= store.maxDelveLevel,
  }))
);

function formatPrice(price: number): string {
  if (price === 0) return "Untradeable";
  if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(0) + "M GP";
  }
  return price.toLocaleString() + " GP";
}
</script>

<template>
  <div class="unique-items">
    <h2 class="panel-title">
      <span class="icon">💎</span>
      Unique Drops
    </h2>

    <div class="items-grid">
      <div
        v-for="item in items"
        :key="item.id"
        :class="[
          'item-card',
          item.rarity,
          { obtained: item.count > 0, locked: !item.unlocked },
        ]"
      >
        <div class="item-icon">
          <span v-if="item.id === 'cloth'">🧵</span>
          <span v-else-if="item.id === 'eye'">👁️</span>
          <span v-else-if="item.id === 'treads'">👢</span>
          <span v-else-if="item.id === 'pet'">🐉</span>
        </div>

        <div class="item-info">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-meta">
            <span class="unlock-level">Delve {{ item.unlocksAt }}+</span>
            <span class="item-price">{{ formatPrice(item.price) }}</span>
          </div>
        </div>

        <div class="item-count" :class="{ active: item.count > 0 }">
          {{ item.count }}
        </div>

        <div v-if="!item.unlocked" class="lock-overlay">
          <span class="lock-icon">🔒</span>
          <span class="lock-text">Delve {{ item.unlocksAt }}+</span>
        </div>

        <div v-if="item.count > 0" class="glow-effect"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unique-items {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #d4af37;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.1);
}

.panel-title {
  color: #d4af37;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.icon {
  font-size: 1.5rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.item-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #2a2a4a;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #3a3a5a;
  transition: all 0.3s;
  overflow: hidden;
}

.item-card.rare {
  border-color: #3498db;
}

.item-card.legendary {
  border-color: #9b59b6;
}

.item-card.pet {
  border-color: #e74c3c;
}

.item-card.obtained {
  animation: obtainPulse 2s ease-in-out infinite;
}

.item-card.obtained.rare {
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
  background: linear-gradient(135deg, #2a2a4a 0%, #2a3a5a 100%);
}

.item-card.obtained.legendary {
  box-shadow: 0 0 25px rgba(155, 89, 182, 0.5);
  background: linear-gradient(135deg, #2a2a4a 0%, #3a2a5a 100%);
}

.item-card.obtained.pet {
  box-shadow: 0 0 25px rgba(231, 76, 60, 0.5);
  background: linear-gradient(135deg, #2a2a4a 0%, #4a2a3a 100%);
}

.item-card.locked {
  opacity: 0.5;
  filter: grayscale(50%);
}

@keyframes obtainPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.item-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  color: #e0e0e0;
  font-weight: bold;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.unlock-level {
  color: #888;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.item-price {
  color: #d4af37;
  font-size: 0.75rem;
}

.item-count {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a2e;
  border-radius: 50%;
  color: #666;
  font-size: 1.1rem;
  font-weight: bold;
  border: 2px solid #3a3a5a;
}

.item-count.active {
  color: #d4af37;
  border-color: #d4af37;
  background: linear-gradient(135deg, #2a2a4a 0%, #3a3a5a 100%);
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.lock-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.lock-text {
  color: #888;
  font-size: 0.75rem;
}

.glow-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(155, 89, 182, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
  animation: glowRotate 10s linear infinite;
}

@keyframes glowRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
