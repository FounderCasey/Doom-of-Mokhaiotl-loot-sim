<script setup lang="ts">
import ControlsBar from "@/components/ControlsBar.vue";
import LootDisplay from "@/components/LootDisplay.vue";
import CollectionLog from "@/components/CollectionLog.vue";
</script>

<template>
  <div class="app-container">
    <h1 class="app-title">Doom of Mokhaiotl Loot Simulator</h1>

    <ControlsBar />

    <main class="main-content">
      <LootDisplay />
      <CollectionLog />
    </main>

    <footer class="app-footer">
      Data from
      <a
        href="https://oldschool.runescape.wiki/w/Doom_of_Mokhaiotl"
        target="_blank"
        rel="noopener"
      >
        OSRS Wiki
      </a>
    </footer>
  </div>
</template>

<style>
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
  background: #0f0f0f;
  color: #e0e0e0;
  min-height: 100vh;
  line-height: 1.5;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

.app-title {
  font-family: "Times New Roman", serif;
  font-size: 2rem;
  color: #d4af37;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin-bottom: 1.5rem;
  text-align: center;
}

.main-content {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
}

.app-footer {
  margin-top: 2rem;
  color: #666;
  font-size: 0.8rem;
}

.app-footer a {
  color: #d4af37;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
