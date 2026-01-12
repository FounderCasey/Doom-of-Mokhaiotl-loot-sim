<script setup lang="ts">
import { useLootStore } from "@/stores/lootStore";
import { useSimulation } from "@/composables/useSimulation";

const store = useLootStore();
const { runSimulation, stopSimulation } = useSimulation();

const delveOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<template>
  <div class="controls-card">
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Roll Once
      </button>
      <button
        v-if="!store.isSimulating"
        class="btn btn-secondary"
        @click="runSimulation()"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
          <line x1="19" y1="3" x2="19" y2="21"></line>
        </svg>
        Auto Roll
      </button>
      <button
        v-else
        class="btn btn-danger"
        @click="stopSimulation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="6" width="12" height="12"></rect>
        </svg>
        Stop ({{ store.currentRun.toLocaleString() }}/{{ store.runsToSimulate.toLocaleString() }})
      </button>
      <button class="btn btn-ghost" @click="store.reset()" :disabled="store.isSimulating">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
.controls-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 640px;
  backdrop-filter: blur(10px);
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
  color: #71717a;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.control-input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e4e4e7;
  padding: 0.625rem 0.875rem;
  font-size: 0.9rem;
  font-family: inherit;
  min-width: 100px;
  text-align: center;
  transition: all 0.2s ease;
}

.control-input:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.2);
}

.control-input:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15);
}

.control-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn svg {
  flex-shrink: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #18181b;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.05);
  color: #a1a1aa;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #e4e4e7;
}
</style>
