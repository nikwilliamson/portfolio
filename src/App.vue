<template>
  <RouterView/>
  <RouterView v-slot="{ Component }" name="blog">
    <div class="modal-container" :class="{ 'is-active': Component }">
      <div class="modal">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </div>
    </div>
  </RouterView>
</template>

<script setup>
import './tokens.css'
</script>