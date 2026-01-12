<script setup lang="ts">
import ControlsBar from "@/components/ControlsBar.vue";
import LootDisplay from "@/components/LootDisplay.vue";
import CollectionLog from "@/components/CollectionLog.vue";
</script>

<template>
  <div class="app-container">
    <!-- Decorative corner elements -->
    <div class="corner-decor top-left"></div>
    <div class="corner-decor top-right"></div>
    <div class="corner-decor bottom-left"></div>
    <div class="corner-decor bottom-right"></div>

    <header class="app-header">
      <div class="title-ornament"></div>
      <h1 class="app-title">Doom of Mokhaiotl</h1>
      <p class="app-subtitle">Loot Simulator</p>
      <div class="title-ornament bottom"></div>
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
      <span class="footer-divider"></span>
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
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

/* Varlamore Color Palette */
:root {
  --varla-bg-dark: #16100b;
  --varla-bg-medium: #1e1610;
  --varla-bg-light: #2a1f17;
  --varla-brown: #3c3022;
  --varla-brown-light: #534331;
  --varla-gold: #e9dcb2;
  --varla-gold-bright: #f4e9c4;
  --varla-gold-dark: #c4a862;
  --varla-emerald: #14ad56;
  --varla-emerald-light: #38d776;
  --varla-cyan: #a9f2f5;
  --varla-blue: #7189da;
  --varla-sage: #86a880;
  --varla-text: #d4c8a8;
  --varla-text-muted: #8a7d65;
}

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
  background: var(--varla-bg-dark);
  background-image:
    radial-gradient(ellipse at 50% 0%, rgba(60, 48, 34, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(60, 48, 34, 0.3) 0%, transparent 50%),
    linear-gradient(180deg, var(--varla-bg-dark) 0%, #1a130d 50%, var(--varla-bg-dark) 100%);
  background-attachment: fixed;
  color: var(--varla-text);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar - Varlamore style */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--varla-bg-medium);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--varla-brown-light);
  border-radius: 4px;
  border: 1px solid var(--varla-brown);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--varla-gold-dark);
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
  position: relative;
}

/* Decorative corner elements */
.corner-decor {
  position: fixed;
  width: 80px;
  height: 80px;
  pointer-events: none;
  opacity: 0.3;
}

.corner-decor::before,
.corner-decor::after {
  content: '';
  position: absolute;
  background: var(--varla-gold-dark);
}

.corner-decor.top-left {
  top: 20px;
  left: 20px;
}
.corner-decor.top-left::before {
  width: 40px;
  height: 2px;
  top: 0;
  left: 0;
}
.corner-decor.top-left::after {
  width: 2px;
  height: 40px;
  top: 0;
  left: 0;
}

.corner-decor.top-right {
  top: 20px;
  right: 20px;
}
.corner-decor.top-right::before {
  width: 40px;
  height: 2px;
  top: 0;
  right: 0;
}
.corner-decor.top-right::after {
  width: 2px;
  height: 40px;
  top: 0;
  right: 0;
}

.corner-decor.bottom-left {
  bottom: 20px;
  left: 20px;
}
.corner-decor.bottom-left::before {
  width: 40px;
  height: 2px;
  bottom: 0;
  left: 0;
}
.corner-decor.bottom-left::after {
  width: 2px;
  height: 40px;
  bottom: 0;
  left: 0;
}

.corner-decor.bottom-right {
  bottom: 20px;
  right: 20px;
}
.corner-decor.bottom-right::before {
  width: 40px;
  height: 2px;
  bottom: 0;
  right: 0;
}
.corner-decor.bottom-right::after {
  width: 2px;
  height: 40px;
  bottom: 0;
  right: 0;
}

.app-header {
  text-align: center;
  margin-bottom: 0.5rem;
  position: relative;
}

.title-ornament {
  width: 120px;
  height: 8px;
  margin: 0 auto 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-ornament::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--varla-gold-dark), transparent);
}

.title-ornament::after {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--varla-gold-dark);
  transform: rotate(45deg);
  position: relative;
  z-index: 1;
}

.title-ornament.bottom {
  margin: 0.75rem auto 0;
}

.app-title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--varla-gold);
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(233, 220, 178, 0.15);
  letter-spacing: 0.05em;
}

.app-subtitle {
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--varla-text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 0.5rem;
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
  color: var(--varla-text-muted);
  font-size: 0.8rem;
}

.app-footer a {
  color: var(--varla-gold-dark);
  text-decoration: none;
  transition: all 0.2s ease;
}

.app-footer a:hover {
  color: var(--varla-gold);
  text-shadow: 0 0 8px rgba(233, 220, 178, 0.3);
}

.footer-divider {
  width: 4px;
  height: 4px;
  background: var(--varla-brown-light);
  transform: rotate(45deg);
  margin: 0 0.5rem;
}
</style>
