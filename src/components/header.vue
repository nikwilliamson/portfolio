<template>
  <header class="header">
    <svg
      class="logo"
      width="23"
      height="64"
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
  padding: calc(8 * var(--font-size-base)) 0;
}

.logo {
  margin-bottom: 2rem;
  height: 2rem;
  fill: var(--color-pink);
  height: 64px;
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
  gap: 1.5rem;
}

h1 {
  font-size: var(--font-size-110);
  line-height: var(--line-height-tight);
  font-weight: var(--font-weight-bold);
}
h2 {
  font-size: var(--font-size-70);
  line-height: var(--line-height-tight);
  font-weight: var(--font-weight-medium);
  width: 100%;
  max-width: var(--size-typography-max-width);
}

@media only screen and (max-width: 1000px) {
  header {
    padding: calc(4 * var(--font-size-base)) 0;
  }

  .logo {
    margin-bottom: 1.5rem;
    height: 2rem;
    fill: var(--color-pink);
    height: 2rem;
    width: auto;
  }
  h1 {
    font-size: var(--font-size-80);
  }
  h2 {
    font-size: var(--font-size-60);
    line-height: var(--line-height-base);
  }
}
</style>
