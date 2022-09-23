<template>
  <div class="header">
    <svg class="logo" width="13" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.355 0 2.818.185 0 17.975l5.304-1.709L1.673 32 13 9.718l-6.251 1.886L11.355 0Z" fill="#E5CD44"/></svg>
      <div>
        <h1>{{ title }}</h1>
        <NWGlowButton :buttonType="buttonType" :label="buttonLabel" />
    </div>
  </div>
</template>

<script>
import NWGlowButton from "./glowButton.vue";
export default {
  name: "PageHeader",
  components: { NWGlowButton },
  props: {
    title: String,
    buttonLabel: String,
    buttonType: Option,
  },
};
</script>

<style scoped>
.logo {
  margin: 2rem 0;
  height: 2rem;
}
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
  padding: 8rem 10vw 10rem;
  box-shadow: 0 0 1rem 0.25rem rgba(0, 0, 0, 0.2);
}

h1 {
  color: #c0c5ce;
  font-weight: 400;
  font-size: 1.777rem;
}
</style>
