<script setup lang="ts">
import { useLootStore } from "@/stores/lootStore";
import { useSimulation } from "@/composables/useSimulation";

const store = useLootStore();
const { runSimulation, stopSimulation } = useSimulation();

const delveOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<template>
  <div class="relative w-full max-w-[640px]">
    <div class="card-border"></div>
    <div class="bg-gradient-to-b from-varla-bg-light to-varla-bg-medium rounded p-6">
      <div class="flex justify-center gap-8 mb-5">
        <div class="flex flex-col gap-2">
          <label class="text-varla-text-muted text-[0.7rem] font-semibold uppercase tracking-widest text-center">
            Delve Level
          </label>
          <select
            v-model.number="store.maxDelveLevel"
            :disabled="store.isSimulating"
            class="bg-varla-bg-dark border border-varla-brown rounded-sm text-varla-gold py-2.5 px-3.5 text-sm font-sans min-w-[100px] text-center transition-all duration-200 hover:border-varla-brown-light focus:outline-none focus:border-varla-gold-dark focus:shadow-[0_0_0_1px_var(--color-varla-gold-dark),inset_0_0_8px_rgba(233,220,178,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option v-for="d in delveOptions" :key="d" :value="d" class="bg-varla-bg-dark text-varla-text">
              {{ d }}{{ d >= 9 ? '+' : '' }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-varla-text-muted text-[0.7rem] font-semibold uppercase tracking-widest text-center">
            Rolls
          </label>
          <input
            type="number"
            v-model.number="store.runsToSimulate"
            min="1"
            max="100000"
            :disabled="store.isSimulating"
            class="bg-varla-bg-dark border border-varla-brown rounded-sm text-varla-gold py-2.5 px-3.5 text-sm font-sans min-w-[100px] text-center transition-all duration-200 hover:border-varla-brown-light focus:outline-none focus:border-varla-gold-dark focus:shadow-[0_0_0_1px_var(--color-varla-gold-dark),inset_0_0_8px_rgba(233,220,178,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-varla-text-muted text-[0.7rem] font-semibold uppercase tracking-widest text-center">
            Delay (ms)
          </label>
          <input
            type="number"
            v-model.number="store.rollInterval"
            min="0"
            max="1000"
            step="50"
            :disabled="store.isSimulating"
            class="bg-varla-bg-dark border border-varla-brown rounded-sm text-varla-gold py-2.5 px-3.5 text-sm font-sans min-w-[100px] text-center transition-all duration-200 hover:border-varla-brown-light focus:outline-none focus:border-varla-gold-dark focus:shadow-[0_0_0_1px_var(--color-varla-gold-dark),inset_0_0_8px_rgba(233,220,178,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div class="flex justify-center gap-3 flex-wrap">
        <button
          @click="runSimulation(1)"
          :disabled="store.isSimulating"
          class="btn-primary"
        >
          Roll Once
        </button>
        <button
          v-if="!store.isSimulating"
          @click="runSimulation()"
          class="btn-secondary"
        >
          Auto Roll
        </button>
        <button
          v-else
          @click="stopSimulation"
          class="btn-danger"
        >
          Stop ({{ store.currentRun.toLocaleString() }}/{{ store.runsToSimulate.toLocaleString() }})
        </button>
        <button
          @click="store.reset()"
          :disabled="store.isSimulating"
          class="btn-ghost"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.btn-primary,
.btn-secondary,
.btn-danger,
.btn-ghost {
  @apply inline-flex items-center justify-center gap-2 py-2.5 px-6 border-none rounded-sm text-[0.85rem] font-semibold font-sans cursor-pointer transition-all duration-200 uppercase tracking-wide;
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-danger:disabled,
.btn-ghost:disabled {
  @apply opacity-40 cursor-not-allowed;
}

.btn-primary {
  background: linear-gradient(180deg, var(--color-varla-gold) 0%, var(--color-varla-gold-dark) 100%);
  color: var(--color-varla-bg-dark);
  border: 1px solid var(--color-varla-gold-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, var(--color-varla-gold-bright) 0%, var(--color-varla-gold) 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 12px rgba(233, 220, 178, 0.2);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: linear-gradient(180deg, var(--color-varla-emerald) 0%, #0f8a45 100%);
  color: white;
  border: 1px solid var(--color-varla-emerald);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(180deg, var(--color-varla-emerald-light) 0%, var(--color-varla-emerald) 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(20, 173, 86, 0.3);
}

.btn-danger {
  background: linear-gradient(180deg, #c44 0%, #a33 100%);
  color: white;
  border: 1px solid #b44;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-danger:hover {
  background: linear-gradient(180deg, #d55 0%, #c44 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(204, 68, 68, 0.3);
}

.btn-ghost {
  @apply bg-transparent text-varla-text-muted border border-varla-brown;
}

.btn-ghost:hover:not(:disabled) {
  @apply bg-varla-brown text-varla-text border-varla-brown-light;
}
</style>
