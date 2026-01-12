<script setup lang="ts">
import ControlsBar from "@/components/ControlsBar.vue";
import LootDisplay from "@/components/LootDisplay.vue";
import CollectionLog from "@/components/CollectionLog.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col items-center py-12 px-6 gap-6 relative">
    <!-- Decorative corner elements -->
    <div class="corner-decor fixed top-5 left-5 w-20 h-20 pointer-events-none opacity-30"></div>
    <div class="corner-decor fixed top-5 right-5 w-20 h-20 pointer-events-none opacity-30 rotate-90"></div>
    <div class="corner-decor fixed bottom-5 left-5 w-20 h-20 pointer-events-none opacity-30 -rotate-90"></div>
    <div class="corner-decor fixed bottom-5 right-5 w-20 h-20 pointer-events-none opacity-30 rotate-180"></div>

    <header class="text-center mb-2 relative">
      <div class="title-ornament w-30 h-2 mx-auto mb-4"></div>
      <h1 class="font-cinzel text-4xl font-bold text-varla-gold tracking-wide drop-shadow-lg">
        Doom of Mokhaiotl
      </h1>
      <p class="font-cinzel text-sm font-medium text-varla-text-muted tracking-widest uppercase mt-2">
        Loot Simulator
      </p>
      <div class="title-ornament w-30 h-2 mx-auto mt-3"></div>
    </header>

    <ControlsBar />

    <main class="w-full max-w-[640px] flex flex-col gap-6">
      <LootDisplay />
      <CollectionLog />
    </main>

    <footer class="mt-auto pt-8 flex items-center gap-2 text-varla-text-muted text-sm">
      <span>Data sourced from</span>
      <a
        href="https://oldschool.runescape.wiki/w/Doom_of_Mokhaiotl"
        target="_blank"
        rel="noopener"
        class="text-varla-gold-dark hover:text-varla-gold transition-colors duration-200 hover:drop-shadow-[0_0_8px_rgba(233,220,178,0.3)]"
      >
        OSRS Wiki
      </a>
      <span class="w-1 h-1 bg-varla-brown-light rotate-45 mx-2"></span>
      <span>Ironman? Join</span>
      <a
        href="https://wiseoldman.net/groups/12095"
        target="_blank"
        rel="noopener"
        class="text-varla-gold-dark hover:text-varla-gold transition-colors duration-200 hover:drop-shadow-[0_0_8px_rgba(233,220,178,0.3)]"
      >
        IronKin
      </a>
    </footer>
  </div>
</template>

<style scoped>
.corner-decor::before,
.corner-decor::after {
  content: '';
  position: absolute;
  background: var(--color-varla-gold-dark);
}

.corner-decor::before {
  width: 40px;
  height: 2px;
  top: 0;
  left: 0;
}

.corner-decor::after {
  width: 2px;
  height: 40px;
  top: 0;
  left: 0;
}

.title-ornament {
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
  background: linear-gradient(90deg, transparent, var(--color-varla-gold-dark), transparent);
}

.title-ornament::after {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--color-varla-gold-dark);
  transform: rotate(45deg);
  position: relative;
  z-index: 1;
}
</style>
