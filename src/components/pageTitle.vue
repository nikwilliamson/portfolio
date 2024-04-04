<template>
  <div class="pageTitle">
    <h3> {{ title }}</h3>
    <NWButton v-if="buttonLabel" :buttonType="buttonType" :label="buttonLabel" />
  </div>
</template>

<script>
import NWButton from "./button.vue";
export default {
  name: "PageTitle",
  components: { NWButton },
  props: {
    title: String,
    buttonLabel: String,
    buttonType: Option,
    theme: Option
  },
};
</script>

<style scoped>
.pageTitle {
    display:flex;
    align-items: center;
}
.button, button {
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
