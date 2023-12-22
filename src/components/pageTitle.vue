<template>
  <div class="pageTitle light">
    <h2> {{ title }}</h2>
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
.light h2 {
  color: #c0c5ce;
  font-weight: 400;
  margin: 0;
}

h2 {
  font-size: 1.777rem;
}
@media (max-width: 1000px) {
  h2 {
    font-size: 1.333rem;
  }
}

</style>
