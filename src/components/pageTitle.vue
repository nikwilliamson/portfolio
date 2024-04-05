<template>
  <div class="pageTitle">
    <h3>{{ title }}</h3>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: String,
    buttonLabel: String,
    buttonType: Option,
    theme: Option
  }
}
</script>

<style scoped>
.pageTitle {
  display: flex;
  align-items: center;
  max-width: var(--size-section-max-width);
  margin: 0 auto;
  width: 100%;
}
.button,
button {
  margin-left: auto;
}

h3 {
  font-size: var(--font-size-50);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-50);
  margin-bottom: var(--size-space-07);
  color: var(--color-title);
}

@media (max-width: 1000px) {
  h3 {
    margin-bottom: var(--size-space-06);
  }
}
</style>
