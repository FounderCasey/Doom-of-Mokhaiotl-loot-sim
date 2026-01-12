<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  name: string;
  subtitle?: string;
  rolls?: number[];
  count?: number;
  image?: string;
}>();

const show = ref(false);
const tooltipX = ref(0);
const tooltipY = ref(0);

function onMouseEnter(e: MouseEvent) {
  show.value = true;
  updatePosition(e);
}

function onMouseMove(e: MouseEvent) {
  updatePosition(e);
}

function onMouseLeave() {
  show.value = false;
}

function updatePosition(e: MouseEvent) {
  tooltipX.value = e.clientX + 12;
  tooltipY.value = e.clientY + 12;
}
</script>

<template>
  <div
    class="tooltip-trigger"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot />

    <Teleport to="body">
      <div
        v-if="show"
        class="tooltip-container"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <div class="tooltip-header">
          <img v-if="image" :src="image" class="tooltip-img" />
          <div class="tooltip-title">
            <span class="tooltip-name">{{ name }}</span>
            <span v-if="subtitle" class="tooltip-subtitle">{{ subtitle }}</span>
          </div>
        </div>

        <div v-if="count !== undefined && count > 0" class="tooltip-stat">
          <span class="stat-label">Obtained:</span>
          <span class="stat-value">{{ count }}x</span>
        </div>

        <div v-if="rolls && rolls.length > 0" class="tooltip-rolls">
          <span class="rolls-label">Roll{{ rolls.length > 1 ? 's' : '' }}:</span>
          <div class="rolls-list">
            <span v-for="(roll, i) in rolls.slice(0, 20)" :key="i" class="roll-number">
              {{ roll }}
            </span>
            <span v-if="rolls.length > 20" class="roll-more">
              +{{ rolls.length - 20 }} more
            </span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tooltip-trigger {
  display: contents;
}

.tooltip-container {
  position: fixed;
  z-index: 9999;
  background: linear-gradient(135deg, #2d2216 0%, #1a1510 100%);
  border: 2px solid #5c4a32;
  border-radius: 4px;
  padding: 0.625rem;
  min-width: 160px;
  max-width: 280px;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #3d3020;
}

.tooltip-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
}

.tooltip-title {
  display: flex;
  flex-direction: column;
}

.tooltip-name {
  color: #d4af37;
  font-weight: bold;
  font-size: 0.9rem;
}

.tooltip-subtitle {
  color: #888;
  font-size: 0.7rem;
}

.tooltip-stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.stat-label {
  color: #888;
  font-size: 0.75rem;
}

.stat-value {
  color: #2ecc71;
  font-size: 0.75rem;
  font-weight: bold;
}

.tooltip-rolls {
  margin-top: 0.375rem;
}

.rolls-label {
  color: #888;
  font-size: 0.7rem;
  display: block;
  margin-bottom: 0.25rem;
}

.rolls-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.roll-number {
  background: #1a1510;
  border: 1px solid #3d3020;
  border-radius: 2px;
  padding: 0.125rem 0.375rem;
  font-size: 0.65rem;
  color: #d4af37;
  font-family: monospace;
}

.roll-more {
  color: #666;
  font-size: 0.65rem;
  padding: 0.125rem 0.25rem;
}
</style>
