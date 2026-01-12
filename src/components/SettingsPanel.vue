<script setup lang="ts">
import { useLootStore } from "@/stores/lootStore";
import { useSimulation } from "@/composables/useSimulation";

const store = useLootStore();
const { runSimulation, stopSimulation } = useSimulation();

const speedOptions = [
  { value: "instant", label: "Instant" },
  { value: "fast", label: "Fast" },
  { value: "normal", label: "Normal" },
  { value: "slow", label: "Slow" },
];
</script>

<template>
  <div class="settings-panel">
    <h2 class="panel-title">
      <span class="icon">⚔️</span>
      Simulation Settings
    </h2>

    <div class="setting-group">
      <label class="setting-label">
        Max Delve Level
        <span class="setting-value">{{ store.maxDelveLevel }}{{ store.maxDelveLevel >= 9 ? '+' : '' }}</span>
      </label>
      <input
        type="range"
        v-model.number="store.maxDelveLevel"
        min="1"
        max="9"
        :disabled="store.isSimulating"
        class="slider"
      />
      <div class="slider-labels">
        <span>1</span>
        <span>9+</span>
      </div>
    </div>

    <div class="setting-group">
      <label class="setting-label">
        Runs to Simulate
        <span class="setting-value">{{ store.runsToSimulate.toLocaleString() }}</span>
      </label>
      <input
        type="range"
        v-model.number="store.runsToSimulate"
        min="1"
        max="10000"
        step="1"
        :disabled="store.isSimulating"
        class="slider"
      />
      <input
        type="number"
        v-model.number="store.runsToSimulate"
        min="1"
        max="10000"
        :disabled="store.isSimulating"
        class="number-input"
      />
    </div>

    <div class="setting-group">
      <label class="setting-label">Simulation Speed</label>
      <div class="speed-buttons">
        <button
          v-for="option in speedOptions"
          :key="option.value"
          :class="['speed-btn', { active: store.simulationSpeed === option.value }]"
          @click="store.simulationSpeed = option.value as any"
          :disabled="store.isSimulating"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="button-group">
      <button
        v-if="!store.isSimulating"
        class="action-btn simulate-btn"
        @click="runSimulation"
      >
        <span class="btn-icon">🎲</span>
        Simulate Runs
      </button>
      <button
        v-else
        class="action-btn stop-btn"
        @click="stopSimulation"
      >
        <span class="btn-icon">⏹️</span>
        Stop ({{ store.currentRun }}/{{ store.runsToSimulate }})
      </button>

      <button
        class="action-btn reset-btn"
        @click="store.reset()"
        :disabled="store.isSimulating"
      >
        <span class="btn-icon">🔄</span>
        Reset All
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
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
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.icon {
  font-size: 1.5rem;
}

.setting-group {
  margin-bottom: 1.25rem;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.setting-value {
  color: #d4af37;
  font-weight: bold;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #2a2a4a;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.number-input {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #2a2a4a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 0.9rem;
  text-align: center;
}

.number-input:focus {
  outline: none;
  border-color: #d4af37;
}

.number-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.speed-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.speed-btn {
  padding: 0.5rem;
  background: #2a2a4a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.speed-btn:hover:not(:disabled) {
  background: #3a3a5a;
  color: #e0e0e0;
}

.speed-btn.active {
  background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
  color: #1a1a2e;
  border-color: #d4af37;
  font-weight: bold;
}

.speed-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.simulate-btn {
  background: linear-gradient(135deg, #8b0000 0%, #6b0000 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.4);
}

.simulate-btn:hover {
  background: linear-gradient(135deg, #a50000 0%, #8b0000 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 0, 0, 0.5);
}

.stop-btn {
  background: linear-gradient(135deg, #b8860b 0%, #8b6914 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.4);
}

.stop-btn:hover {
  background: linear-gradient(135deg, #d4a017 0%, #b8860b 100%);
}

.reset-btn {
  background: #2a2a4a;
  color: #888;
  border: 1px solid #444;
}

.reset-btn:hover:not(:disabled) {
  background: #3a3a5a;
  color: #e0e0e0;
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
}
</style>
