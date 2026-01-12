<script setup lang="ts">
import { useLootStore } from "@/stores/lootStore";
import { useSimulation } from "@/composables/useSimulation";

const store = useLootStore();
const { runSimulation, stopSimulation } = useSimulation();

const delveOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<template>
  <div class="controls-card">
    <div class="card-border"></div>
    <div class="controls-inner">
      <div class="controls-row">
        <div class="control-group">
          <label class="control-label">Delve Level</label>
          <select v-model.number="store.maxDelveLevel" :disabled="store.isSimulating" class="control-input">
            <option v-for="d in delveOptions" :key="d" :value="d">
              {{ d }}{{ d >= 9 ? '+' : '' }}
            </option>
          </select>
        </div>

        <div class="control-group">
          <label class="control-label">Rolls</label>
          <input
            type="number"
            v-model.number="store.runsToSimulate"
            min="1"
            max="100000"
            :disabled="store.isSimulating"
            class="control-input"
          />
        </div>

        <div class="control-group">
          <label class="control-label">Delay (ms)</label>
          <input
            type="number"
            v-model.number="store.rollInterval"
            min="0"
            max="1000"
            step="50"
            :disabled="store.isSimulating"
            class="control-input"
          />
        </div>
      </div>

      <div class="buttons-row">
        <button class="btn btn-primary" @click="runSimulation(1)" :disabled="store.isSimulating">
          Roll Once
        </button>
        <button
          v-if="!store.isSimulating"
          class="btn btn-secondary"
          @click="runSimulation()"
        >
          Auto Roll
        </button>
        <button
          v-else
          class="btn btn-danger"
          @click="stopSimulation"
        >
          Stop ({{ store.currentRun.toLocaleString() }}/{{ store.runsToSimulate.toLocaleString() }})
        </button>
        <button class="btn btn-ghost" @click="store.reset()" :disabled="store.isSimulating">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls-card {
  position: relative;
  width: 100%;
  max-width: 640px;
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

.controls-inner {
  background: linear-gradient(180deg, var(--varla-bg-light) 0%, var(--varla-bg-medium) 100%);
  border-radius: 4px;
  padding: 1.5rem;
}

.controls-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.25rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  color: var(--varla-text-muted);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
}

.control-input {
  background: var(--varla-bg-dark);
  border: 1px solid var(--varla-brown);
  border-radius: 2px;
  color: var(--varla-gold);
  padding: 0.625rem 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
  min-width: 100px;
  text-align: center;
  transition: all 0.2s ease;
}

.control-input:hover:not(:disabled) {
  border-color: var(--varla-brown-light);
}

.control-input:focus {
  outline: none;
  border-color: var(--varla-gold-dark);
  box-shadow: 0 0 0 1px var(--varla-gold-dark), inset 0 0 8px rgba(233, 220, 178, 0.1);
}

.control-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-input option {
  background: var(--varla-bg-dark);
  color: var(--varla-text);
}

.buttons-row {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 2px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(180deg, var(--varla-gold) 0%, var(--varla-gold-dark) 100%);
  color: var(--varla-bg-dark);
  border: 1px solid var(--varla-gold-dark);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, var(--varla-gold-bright) 0%, var(--varla-gold) 100%);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 12px rgba(233, 220, 178, 0.2);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: linear-gradient(180deg, var(--varla-emerald) 0%, #0f8a45 100%);
  color: white;
  border: 1px solid var(--varla-emerald);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(180deg, var(--varla-emerald-light) 0%, var(--varla-emerald) 100%);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 12px rgba(20, 173, 86, 0.3);
}

.btn-danger {
  background: linear-gradient(180deg, #c44 0%, #a33 100%);
  color: white;
  border: 1px solid #b44;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-danger:hover {
  background: linear-gradient(180deg, #d55 0%, #c44 100%);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 12px rgba(204, 68, 68, 0.3);
}

.btn-ghost {
  background: transparent;
  color: var(--varla-text-muted);
  border: 1px solid var(--varla-brown);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--varla-brown);
  color: var(--varla-text);
  border-color: var(--varla-brown-light);
}
</style>
