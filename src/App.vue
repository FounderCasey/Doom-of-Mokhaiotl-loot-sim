<script setup lang="ts">
import SettingsPanel from "@/components/SettingsPanel.vue";
import StatsDisplay from "@/components/StatsDisplay.vue";
import UniqueItems from "@/components/UniqueItems.vue";
import LootLog from "@/components/LootLog.vue";
import DropRateTable from "@/components/DropRateTable.vue";
import ProbabilityCalc from "@/components/ProbabilityCalc.vue";
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <div class="title-area">
          <h1 class="app-title">
            <span class="doom-icon">💀</span>
            Doom of Mokhaiotl
            <span class="doom-icon">💀</span>
          </h1>
          <p class="app-subtitle">Loot Simulator</p>
        </div>
        <div class="header-decoration"></div>
      </div>
    </header>

    <main class="app-main">
      <div class="main-grid">
        <!-- Left Column: Controls & Stats -->
        <aside class="sidebar-left">
          <SettingsPanel />
          <StatsDisplay />
        </aside>

        <!-- Center Column: Main Content -->
        <section class="main-content">
          <UniqueItems />
          <LootLog />
        </section>

        <!-- Right Column: Reference & Calculator -->
        <aside class="sidebar-right">
          <DropRateTable />
          <ProbabilityCalc />
        </aside>
      </div>
    </main>

    <footer class="app-footer">
      <p>
        Data sourced from
        <a
          href="https://oldschool.runescape.wiki/w/Doom_of_Mokhaiotl"
          target="_blank"
          rel="noopener"
        >
          OSRS Wiki
        </a>
        • Not affiliated with Jagex
      </p>
    </footer>
  </div>
</template>

<style>
/* Global styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: linear-gradient(180deg, #0d0d1a 0%, #1a0a0a 50%, #0d0d1a 100%);
  background-attachment: fixed;
  color: #e0e0e0;
  min-height: 100vh;
  line-height: 1.5;
}

/* Add subtle background pattern */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
  z-index: -1;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(180deg, rgba(139, 0, 0, 0.3) 0%, transparent 100%);
  border-bottom: 2px solid #d4af37;
  padding: 1.5rem 2rem;
  position: relative;
  overflow: hidden;
}

.app-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200%;
  height: 100%;
  background: radial-gradient(
    ellipse at center top,
    rgba(139, 0, 0, 0.4) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
}

.title-area {
  text-align: center;
}

.app-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.5),
    0 0 60px rgba(139, 0, 0, 0.3);
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.doom-icon {
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.app-subtitle {
  color: #888;
  font-size: 1.1rem;
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 4px;
}

.header-decoration {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #8b0000 20%,
    #d4af37 50%,
    #8b0000 80%,
    transparent 100%
  );
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.main-grid {
  display: grid;
  grid-template-columns: 320px 1fr 360px;
  gap: 1.5rem;
  align-items: start;
}

.sidebar-left,
.sidebar-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.app-footer {
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid #2a2a4a;
  color: #666;
  font-size: 0.85rem;
}

.app-footer a {
  color: #d4af37;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .main-grid {
    grid-template-columns: 280px 1fr 320px;
  }
}

@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "settings stats"
      "uniques uniques"
      "log log"
      "rates calc";
  }

  .sidebar-left {
    display: contents;
  }

  .sidebar-left > :first-child {
    grid-area: settings;
  }

  .sidebar-left > :last-child {
    grid-area: stats;
  }

  .main-content {
    display: contents;
  }

  .main-content > :first-child {
    grid-area: uniques;
  }

  .main-content > :last-child {
    grid-area: log;
  }

  .sidebar-right {
    display: contents;
    position: static;
  }

  .sidebar-right > :first-child {
    grid-area: rates;
  }

  .sidebar-right > :last-child {
    grid-area: calc;
  }
}

@media (max-width: 768px) {
  .app-main {
    padding: 1rem;
  }

  .main-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "settings"
      "stats"
      "uniques"
      "log"
      "calc"
      "rates";
  }

  .app-title {
    font-size: 1.5rem;
  }

  .doom-icon {
    font-size: 1.25rem;
  }

  .app-subtitle {
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
}
</style>
