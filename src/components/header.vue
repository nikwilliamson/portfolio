<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <NWButton :buttonType="buttonType" :label="buttonLabel" />
  </div>
</template>

<script>
import NWButton from "./button.vue";
export default {
  name: "PageHeader",
  components: { NWButton },
  props: {
    title: String,
    buttonLabel: String,
    buttonType: Option,
  },
};
</script>

<style scoped>
.pageTitle {
  display: flex;
  align-items: center;
}
.button,
button {
  margin-left: auto;
}
.header {
  background: #232830;
  color: #fff;
  padding: 8rem 10vw;
  box-shadow: 0 0 1rem 0.25rem rgba(0, 0, 0, 0.2);
}

h1 {
  color: #c0c5ce;
  font-weight: 400;
  font-size: 1.777rem;
}
</style>
