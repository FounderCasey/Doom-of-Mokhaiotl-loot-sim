<script setup lang="ts">
import ControlsBar from "@/components/ControlsBar.vue";
import LootDisplay from "@/components/LootDisplay.vue";
import CollectionLog from "@/components/CollectionLog.vue";
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">Doom of Mokhaiotl</h1>
      <p class="app-subtitle">Loot Simulator</p>
    </header>

    <ControlsBar />

    <main class="main-content">
      <LootDisplay />
      <CollectionLog />
    </main>

    <footer class="app-footer">
      <span>Data sourced from</span>
      <a
        href="https://oldschool.runescape.wiki/w/Doom_of_Mokhaiotl"
        target="_blank"
        rel="noopener"
      >
        OSRS Wiki
      </a>
      <span class="footer-divider">|</span>
      <span>Ironman? Join</span>
      <a
        href="https://wiseoldman.net/groups/12095"
        target="_blank"
        rel="noopener"
      >
        IronKin
      </a>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%);
  background-attachment: fixed;
  color: #e4e4e7;
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  gap: 1.5rem;
}

.app-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.app-subtitle {
  font-size: 1rem;
  font-weight: 500;
  color: #71717a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.main-content {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.app-footer {
  margin-top: auto;
  padding-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #52525b;
  font-size: 0.8rem;
}

.app-footer a {
  color: #a1a1aa;
  text-decoration: none;
  transition: color 0.2s ease;
}

.app-footer a:hover {
  color: #fbbf24;
}

.footer-divider {
  color: #3f3f46;
}
</style>
