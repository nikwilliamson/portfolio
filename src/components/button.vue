<template>
  <button class="button" v-if="buttonType === 'button'">{{ label }}</button>
  <a class="button" v-else href="#">{{ label }}</a>
</template>

<script>
export default {
  name: "NWButton",
  props: {
    label: String,
    buttonType: Option
  },
};
</script>

<style scoped>
.button, button {
    display: inline-block;
    border: none;
    padding: 0.3rem 0.6rem;
    color: #FFF;
    text-decoration: none;
    border-radius: 0.134rem;
    font-weight: 600;
    letter-spacing: .096rem;
    font-size: .75rem;
    margin: 0;
    box-sizing: border-box;
    line-height: initial;
    transition: background-color 0.1s ease-in-out;
    position: relative;
    background: #232830;
}

.button:hover, button:hover {
  background: #4158D0;
  transition: background-color 0.1s ease-in-out;
}
</style>
