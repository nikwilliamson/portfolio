<template>
  <header class="header">
    <svg
      class="logo"
      viewBox="0 0 23 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.7622 0L4.90434 0.369927L0 35.9521L9.2317 32.5331L2.91164 64L22.6738 19.4359L11.7457 23.2081L19.7622 0Z"
      />
    </svg>
    <div class="title">
      <h1>{{ title }}</h1>
      <h2>{{ subtitle }}</h2>
      <NWGlowButton v-if="buttonLabel" buttonType="buttonType" :label="buttonLabel" />
    </div>
  </header>
</template>

<script>
import NWGlowButton from './glowButton.vue'
export default {
  name: 'PageHeader',
  components: { NWGlowButton },
  props: {
    title: String,
    subtitle: String,
    buttonLabel: String,
    buttonType: Option
  }
}
</script>

<style scoped>
header {
  padding: var(--size-section-spacing);
  max-width: var(--size-section-max-width);
}

.logo {
  margin-bottom: var(--size-logo-spacing);
  height: var(--size-logo-height);
  fill: var(--color-logo);
  width: auto;
}
.pageTitle {
  display: flex;
  align-items: center;
}
.button,
button {
  margin-left: auto;
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  gap: var(--size-component-spacing-base);
}

h1 {
  font-size: var(--font-size-header-title);
  line-height: var(--line-height-tight);
  font-weight: var(--font-weight-bold);
}
h2 {
  font-size: var(--font-size-subtitle);
  font-weight: var(--font-weight-medium);
  width: 100%;
  max-width: var(--size-typography-max-width);
}
</style>
