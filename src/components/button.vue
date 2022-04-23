<template>
  <button class="button" v-if="buttonType === 'button'">{{ label }}</button>
  <a class="button" v-else href="#"> {{ label}}</a>
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
    background: #232830;
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
    transition-property: background-image;
    transition-duration: 4s;
    transition-delay: 2s;
    position:relative;
}
.button:before, button:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.134rem;
  color: #ff0099;
}
.button:hover, button:hover {
  background-image: linear-gradient(270deg, #C850C0, #4158D0);
}
</style>
