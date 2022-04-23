<template>
  <div class="pageTitle light">
    <h1> {{ title }}</h1>
    <NWButton :buttonType="buttonType" :label="buttonLabel" />
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
.light h1 {
  color: #c0c5ce;
  font-weight: 400;
  margin: 0;
}

h1 {
  font-size: 1.777rem;
}

</style>
