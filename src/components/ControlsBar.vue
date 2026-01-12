<script setup lang="ts">
import { useLootStore } from "@/stores/lootStore";
import { useSimulation } from "@/composables/useSimulation";

const store = useLootStore();
const { runSimulation, stopSimulation } = useSimulation();

const delveOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<template>
  <div class="controls-bar">
    <div class="control-group">
      <label>Delve Level:</label>
      <select v-model.number="store.maxDelveLevel" :disabled="store.isSimulating">
        <option v-for="d in delveOptions" :key="d" :value="d">
          {{ d }}{{ d >= 9 ? '+' : '' }}
        </option>
      </select>
    </div>

    <div class="control-group">
      <label>Rolls:</label>
      <input
        type="number"
        v-model.number="store.runsToSimulate"
        min="1"
        max="10000"
        :disabled="store.isSimulating"
      />
    </div>

    <div class="control-group">
      <label>Speed (ms):</label>
      <input
        type="number"
        v-model.number="store.rollInterval"
        min="0"
        max="1000"
        step="50"
        :disabled="store.isSimulating"
      />
    </div>

    <div class="buttons">
      <button class="btn roll-btn" @click="runSimulation(1)" :disabled="store.isSimulating">
        Roll
      </button>
      <button
        v-if="!store.isSimulating"
        class="btn auto-btn"
        @click="runSimulation()"
      >
        Start Auto Roll
      </button>
      <button
        v-else
        class="btn stop-btn"
        @click="stopSimulation"
      >
        Stop ({{ store.currentRun }}/{{ store.runsToSimulate }})
      </button>
      <button class="btn reset-btn" @click="store.reset()" :disabled="store.isSimulating">
        Reset
      </button>
    </div>
  </div>
</template>

<style scoped>
.controls-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.control-group label {
  color: #888;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.control-group select,
.control-group input {
  background: #1a1a2e;
  border: 1px solid #333;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  min-width: 80px;
  text-align: center;
}

.control-group select:focus,
.control-group input:focus {
  outline: none;
  border-color: #d4af37;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.roll-btn {
  background: #d4af37;
  color: #1a1a2e;
}

.roll-btn:hover:not(:disabled) {
  background: #e5c04b;
}

.auto-btn {
  background: #3498db;
  color: #fff;
}

.auto-btn:hover:not(:disabled) {
  background: #4aa3e0;
}

.stop-btn {
  background: #e74c3c;
  color: #fff;
}

.stop-btn:hover {
  background: #ec6b5e;
}

.reset-btn {
  background: #c0392b;
  color: #fff;
}

.reset-btn:hover:not(:disabled) {
  background: #d64937;
}
</style>
