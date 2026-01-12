<script setup lang="ts">
import { ref, computed } from "vue";
import { useSimulation } from "@/composables/useSimulation";
import { UNIQUE_ITEMS } from "@/data/dropRates";

const { calculateProbability, calculateExpectedRuns } = useSimulation();

const selectedItem = ref("cloth");
const maxDelve = ref(9);
const targetRuns = ref(100);

const items = UNIQUE_ITEMS.map((item) => ({
  value: item.id,
  label: item.name,
  unlocksAt: item.unlocksAt,
}));

const probability = computed(() => {
  if (UNIQUE_ITEMS.find((i) => i.id === selectedItem.value)?.unlocksAt! > maxDelve.value) {
    return 0;
  }
  return calculateProbability(selectedItem.value, maxDelve.value, targetRuns.value);
});

const expectedRuns = computed(() => {
  if (UNIQUE_ITEMS.find((i) => i.id === selectedItem.value)?.unlocksAt! > maxDelve.value) {
    return Infinity;
  }
  return calculateExpectedRuns(selectedItem.value, maxDelve.value);
});

const isLocked = computed(() => {
  const item = UNIQUE_ITEMS.find((i) => i.id === selectedItem.value);
  return item ? item.unlocksAt > maxDelve.value : false;
});

function formatPercent(value: number): string {
  if (value >= 0.9999) return ">99.99%";
  if (value < 0.0001) return "<0.01%";
  return (value * 100).toFixed(2) + "%";
}

function formatExpected(value: number): string {
  if (value === Infinity) return "N/A";
  return value.toLocaleString();
}
</script>

<template>
  <div class="probability-calc">
    <h2 class="panel-title">
      <span class="icon">🔮</span>
      Probability Calculator
    </h2>

    <div class="calc-inputs">
      <div class="input-group">
        <label>Target Item</label>
        <select v-model="selectedItem" class="select-input">
          <option v-for="item in items" :key="item.value" :value="item.value">
            {{ item.label }} (D{{ item.unlocksAt }}+)
          </option>
        </select>
      </div>

      <div class="input-group">
        <label>Max Delve Level</label>
        <input
          type="range"
          v-model.number="maxDelve"
          min="1"
          max="9"
          class="slider"
        />
        <span class="slider-value">{{ maxDelve }}{{ maxDelve >= 9 ? '+' : '' }}</span>
      </div>

      <div class="input-group">
        <label>Number of Runs</label>
        <input
          type="number"
          v-model.number="targetRuns"
          min="1"
          max="100000"
          class="number-input"
        />
      </div>
    </div>

    <div v-if="isLocked" class="locked-warning">
      <span class="warning-icon">🔒</span>
      <span>This item is not available at Delve {{ maxDelve }}</span>
    </div>

    <div v-else class="calc-results">
      <div class="result-card main-result">
        <div class="result-label">Chance of at least 1 drop</div>
        <div class="result-value" :class="{ high: probability > 0.5, low: probability < 0.1 }">
          {{ formatPercent(probability) }}
        </div>
        <div class="result-context">after {{ targetRuns.toLocaleString() }} runs</div>
      </div>

      <div class="result-card">
        <div class="result-label">Expected runs for drop</div>
        <div class="result-value expected">{{ formatExpected(expectedRuns) }}</div>
        <div class="result-context">on average</div>
      </div>

      <div class="probability-bar">
        <div class="bar-fill" :style="{ width: `${probability * 100}%` }"></div>
        <div class="bar-markers">
          <span class="marker" style="left: 50%">50%</span>
          <span class="marker" style="left: 90%">90%</span>
        </div>
      </div>

      <div class="quick-calc">
        <span class="quick-label">Quick calculations:</span>
        <div class="quick-buttons">
          <button @click="targetRuns = expectedRuns" :disabled="expectedRuns === Infinity">
            Set to expected ({{ formatExpected(expectedRuns) }})
          </button>
          <button @click="targetRuns = Math.ceil(expectedRuns * 2)" :disabled="expectedRuns === Infinity">
            2x expected
          </button>
          <button @click="targetRuns = Math.ceil(expectedRuns * 3)" :disabled="expectedRuns === Infinity">
            3x expected
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.probability-calc {
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

.calc-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: #888;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-input,
.number-input {
  padding: 0.625rem;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.select-input:focus,
.number-input:focus {
  outline: none;
  border-color: #d4af37;
}

.slider {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #2a2a4a;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
  cursor: pointer;
}

.input-group:has(.slider) {
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

.input-group:has(.slider) label {
  width: 100%;
}

.slider-value {
  min-width: 40px;
  text-align: right;
  color: #d4af37;
  font-weight: bold;
}

.locked-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 6px;
  color: #e74c3c;
  font-size: 0.9rem;
}

.warning-icon {
  font-size: 1.25rem;
}

.calc-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-card {
  background: #2a2a4a;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.result-card.main-result {
  background: linear-gradient(135deg, #2a2a4a 0%, #3a2a5a 100%);
  border: 1px solid #9b59b6;
}

.result-label {
  color: #888;
  font-size: 0.8rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 2rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

.result-value.high {
  color: #2ecc71;
  text-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
}

.result-value.low {
  color: #e74c3c;
  text-shadow: 0 0 15px rgba(231, 76, 60, 0.3);
}

.result-value.expected {
  font-size: 1.5rem;
  color: #3498db;
}

.result-context {
  color: #666;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.probability-bar {
  position: relative;
  height: 24px;
  background: #2a2a4a;
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #e74c3c 0%, #f1c40f 50%, #2ecc71 100%);
  border-radius: 12px;
  transition: width 0.3s ease;
}

.bar-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.quick-calc {
  margin-top: 0.5rem;
}

.quick-label {
  color: #666;
  font-size: 0.75rem;
  display: block;
  margin-bottom: 0.5rem;
}

.quick-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-buttons button {
  flex: 1;
  min-width: 100px;
  padding: 0.5rem;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 4px;
  color: #888;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-buttons button:hover:not(:disabled) {
  background: #3a3a5a;
  color: #e0e0e0;
  border-color: #d4af37;
}

.quick-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
