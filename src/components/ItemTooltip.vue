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
    class="contents"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot />

    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="show"
          class="fixed z-[9999] min-w-[180px] max-w-[240px] pointer-events-none"
          :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
        >
          <div class="tooltip-border"></div>
          <div class="tooltip-inner rounded p-3">
            <div class="flex items-center gap-2.5 mb-2.5 pb-2.5 border-b border-varla-brown">
              <img v-if="image" :src="image" class="w-8 h-8 object-contain pixelated shrink-0" />
              <div class="flex flex-col gap-0.5 min-w-0">
                <span class="font-cinzel text-varla-gold font-semibold text-[0.85rem] leading-tight">{{ name }}</span>
                <span v-if="subtitle" class="text-varla-text-muted text-[0.65rem]">{{ subtitle }}</span>
              </div>
            </div>

            <div v-if="count !== undefined && count > 0" class="flex justify-between items-center mb-2">
              <span class="text-varla-text-muted text-[0.7rem]">Obtained</span>
              <span class="text-rare-yellow text-[0.75rem] font-semibold">{{ count }}x</span>
            </div>

            <div v-if="rolls && rolls.length > 0" class="mt-2">
              <span class="text-varla-text-muted text-[0.65rem] block mb-1.5">Obtained at roll{{ rolls.length > 1 ? 's' : '' }}</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(roll, i) in displayRolls"
                  :key="i"
                  class="bg-varla-bg-dark border border-varla-brown rounded-sm py-0.5 px-1.5 text-[0.6rem] text-varla-gold-dark tabular-nums"
                >
                  #{{ roll.toLocaleString() }}
                </span>
                <span v-if="hasMoreRolls" class="text-varla-text-muted text-[0.6rem] py-0.5 px-1 self-center">
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
.tooltip-inner {
  background: linear-gradient(180deg, var(--color-varla-bg-light) 0%, var(--color-varla-bg-dark) 100%);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    0 8px 24px rgba(0, 0, 0, 0.3);
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
