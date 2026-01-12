<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  name: string;
  subtitle?: string;
  rolls?: number[];
  count?: number;
  image?: string;
}>();

const show = ref(false);
const tooltipX = ref(0);
const tooltipY = ref(0);

const displayRolls = computed(() => {
  if (!props.rolls) return [];
  return props.rolls.slice(0, 12);
});

const hasMoreRolls = computed(() => {
  return props.rolls && props.rolls.length > 12;
});

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
  const offset = 16;
  const padding = 12;

  let x = e.clientX + offset;
  let y = e.clientY + offset;

  // Prevent tooltip from going off-screen
  const tooltipWidth = 240;
  const tooltipHeight = 160;

  if (x + tooltipWidth + padding > window.innerWidth) {
    x = e.clientX - tooltipWidth - offset;
  }

  if (y + tooltipHeight + padding > window.innerHeight) {
    y = e.clientY - tooltipHeight - offset;
  }

  tooltipX.value = x;
  tooltipY.value = y;
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
      <Transition name="tooltip">
        <div
          v-if="show"
          class="tooltip-container"
          :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
        >
          <div class="tooltip-border"></div>
          <div class="tooltip-inner">
            <div class="tooltip-header">
              <img v-if="image" :src="image" class="tooltip-img" />
              <div class="tooltip-title">
                <span class="tooltip-name">{{ name }}</span>
                <span v-if="subtitle" class="tooltip-subtitle">{{ subtitle }}</span>
              </div>
            </div>

            <div v-if="count !== undefined && count > 0" class="tooltip-stat">
              <span class="stat-label">Obtained</span>
              <span class="stat-value">{{ count }}x</span>
            </div>

            <div v-if="rolls && rolls.length > 0" class="tooltip-rolls">
              <span class="rolls-label">Obtained at roll{{ rolls.length > 1 ? 's' : '' }}</span>
              <div class="rolls-list">
                <span v-for="(roll, i) in displayRolls" :key="i" class="roll-badge">
                  #{{ roll.toLocaleString() }}
                </span>
                <span v-if="hasMoreRolls" class="roll-more">
                  +{{ rolls.length - 12 }} more
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
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
  min-width: 180px;
  max-width: 240px;
  pointer-events: none;
}

.tooltip-border {
  position: absolute;
  inset: 0;
  border: 2px solid var(--varla-brown);
  border-radius: 4px;
  pointer-events: none;
}

.tooltip-border::before {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1px solid var(--varla-brown-light);
  border-radius: 2px;
}

.tooltip-inner {
  background: linear-gradient(180deg, var(--varla-bg-light) 0%, var(--varla-bg-dark) 100%);
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.625rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--varla-brown);
}

.tooltip-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.tooltip-title {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.tooltip-name {
  font-family: 'Cinzel', serif;
  color: var(--varla-gold);
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.2;
}

.tooltip-subtitle {
  color: var(--varla-text-muted);
  font-size: 0.65rem;
}

.tooltip-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--varla-text-muted);
  font-size: 0.7rem;
}

.stat-value {
  color: #ffcc00;
  font-size: 0.75rem;
  font-weight: 600;
}

.tooltip-rolls {
  margin-top: 0.5rem;
}

.rolls-label {
  color: var(--varla-text-muted);
  font-size: 0.65rem;
  display: block;
  margin-bottom: 0.375rem;
}

.rolls-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.roll-badge {
  background: var(--varla-bg-dark);
  border: 1px solid var(--varla-brown);
  border-radius: 2px;
  padding: 0.125rem 0.375rem;
  font-size: 0.6rem;
  color: var(--varla-gold-dark);
  font-variant-numeric: tabular-nums;
}

.roll-more {
  color: var(--varla-text-muted);
  font-size: 0.6rem;
  padding: 0.125rem 0.25rem;
  align-self: center;
}

/* Transition */
.tooltip-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.tooltip-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tooltip-leave-to {
  opacity: 0;
  transform: translateY(2px);
}
</style>
