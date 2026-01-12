<script setup lang="ts">
import { computed } from "vue";
import { useLootStore } from "@/stores/lootStore";
import { UNIQUE_ITEMS } from "@/data/dropRates";
import ItemTooltip from "./ItemTooltip.vue";

const store = useLootStore();

const images: Record<string, string> = {
  cloth: "/src/assets/images/mokhaiotl_cloth.png",
  eye: "/src/assets/images/eye_of_ayak.png",
  treads: "/src/assets/images/avernic_treads.png",
  pet: "/src/assets/images/dom.png",
};

const collectionItems = computed(() =>
  UNIQUE_ITEMS.map((item) => ({
    ...item,
    image: images[item.id],
    count: store.uniqueCounts[item.id] || 0,
    obtained: (store.uniqueCounts[item.id] || 0) > 0,
    unlocked: item.unlocksAt <= store.maxDelveLevel,
    rolls: store.uniqueObtainedAtRolls[item.id] || [],
  }))
);

const obtainedCount = computed(
  () => collectionItems.value.filter((i) => i.obtained).length
);
</script>

<template>
  <div class="collection-section">
    <h3 class="section-title">
      Collection Log ({{ obtainedCount }}/{{ UNIQUE_ITEMS.length }})
    </h3>
    <div class="collection-box">
      <ItemTooltip
        v-for="item in collectionItems"
        :key="item.id"
        :name="item.name"
        :subtitle="`Unlocks at Delve ${item.unlocksAt}`"
        :image="item.image"
        :count="item.obtained ? item.count : undefined"
        :rolls="item.obtained ? item.rolls : undefined"
      >
        <div
          class="collection-item"
          :class="{
            obtained: item.obtained,
            locked: !item.unlocked,
          }"
        >
          <img :src="item.image" :alt="item.name" class="item-img" />
          <span v-if="item.obtained" class="item-count">{{ item.count }}</span>
          <span v-if="!item.unlocked" class="lock-icon">🔒</span>
        </div>
      </ItemTooltip>
    </div>
  </div>
</template>

<style scoped>
.collection-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.section-title {
  color: #d4af37;
  font-size: 1rem;
  font-weight: normal;
}

.collection-box {
  background: #2d2216;
  border: 2px solid #5c4a32;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  max-width: 400px;
}

.collection-item {
  position: relative;
  width: 50px;
  height: 50px;
  background: #1a1510;
  border: 1px solid #3d3020;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  filter: grayscale(100%);
  transition: all 0.3s;
}

.collection-item.obtained {
  opacity: 1;
  filter: none;
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.collection-item.locked {
  opacity: 0.3;
}

.item-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-count {
  position: absolute;
  bottom: 1px;
  right: 3px;
  font-size: 0.65rem;
  color: #2ecc71;
  text-shadow: 1px 1px 1px #000, -1px -1px 1px #000;
  font-weight: bold;
}

.lock-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.6rem;
}
</style>
