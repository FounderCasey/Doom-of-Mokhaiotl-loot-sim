<script setup lang="ts">
import { DROP_RATES, DEMON_TEARS } from "@/data/dropRates";

const delveLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function formatRate(rate: number | null): string {
  if (rate === null) return "—";
  return `1/${rate.toLocaleString()}`;
}
</script>

<template>
  <div class="drop-rate-table">
    <h2 class="panel-title">
      <span class="icon">📋</span>
      Drop Rate Reference
    </h2>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="delve-col">Delve</th>
            <th>Cloth</th>
            <th>Eye</th>
            <th>Treads</th>
            <th>Pet</th>
            <th class="tears-col">Tears</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="level in delveLevels" :key="level" :class="{ deep: level >= 9 }">
            <td class="delve-col">{{ level }}{{ level >= 9 ? '+' : '' }}</td>
            <td :class="{ available: DROP_RATES[level].cloth !== null }">
              {{ formatRate(DROP_RATES[level].cloth) }}
            </td>
            <td :class="{ available: DROP_RATES[level].eye !== null }">
              {{ formatRate(DROP_RATES[level].eye) }}
            </td>
            <td :class="{ available: DROP_RATES[level].treads !== null }">
              {{ formatRate(DROP_RATES[level].treads) }}
            </td>
            <td :class="{ available: DROP_RATES[level].pet !== null, pet: DROP_RATES[level].pet !== null }">
              {{ formatRate(DROP_RATES[level].pet) }}
            </td>
            <td class="tears-col">{{ DEMON_TEARS[level] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot available"></span>
        <span>Available</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot unavailable"></span>
        <span>Not available</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-rate-table {
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

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

th {
  background: #2a2a4a;
  color: #d4af37;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid #d4af37;
  white-space: nowrap;
}

td {
  padding: 0.625rem 0.5rem;
  text-align: center;
  border-bottom: 1px solid #3a3a5a;
  color: #666;
}

td.available {
  color: #3498db;
  font-weight: 500;
}

td.pet {
  color: #e74c3c;
}

tr:hover {
  background: rgba(212, 175, 55, 0.05);
}

tr.deep {
  background: rgba(139, 0, 0, 0.1);
}

tr.deep:hover {
  background: rgba(139, 0, 0, 0.15);
}

.delve-col {
  color: #d4af37 !important;
  font-weight: bold;
}

.tears-col {
  color: #e74c3c !important;
}

.legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #3a3a5a;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #888;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.available {
  background: #3498db;
}

.legend-dot.unavailable {
  background: #666;
}
</style>
