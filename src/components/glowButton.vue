<template>
  <div class="glowButtonWrapper">
    <NWButton :buttonType="buttonType" :label="label" />
  </div>
</template>

<script>
import NWButton from "./button.vue";
export default {
  name: "NWGlowButton",
  components: { NWButton },
  props: {
    label: String,
    buttonType: Option,
  },
  // created: function () {
  //   const root = document.documentElement;
 
  //   document.addEventListener('mousemove', evt => {
  //       let x = evt.clientX / innerWidth;
  //       let y = evt.clientY / innerHeight;
    
  //       root.style.setProperty('--mouse-x', x);
  //       root.style.setProperty('--mouse-y', y);
  //   });
  // },
};

</script>

<style scoped>
.glowButtonWrapper {
  position:relative;
  display: inline-block;
}

.glowButtonWrapper::before {
  content: "";
  position: absolute;
  display: inline-block;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.134rem;
  background: transparent radial-gradient(at calc(var(--mouse-x, 0) * 100%) calc(var(--mouse-y, 0) * 100%), #FFCC70, #C850C0, #4158D0) no-repeat 0 0;
  filter: blur(.5rem);
  transform: transale3d(0,0,0); 
  transition: transform .5s ease-in;
}

.glowButtonWrapper:hover::before {
  content: "";
  position: absolute;
  display: inline-block;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.134rem;
  background: transparent radial-gradient(at calc(var(--mouse-x, 0) * 100%) calc(var(--mouse-y, 0) * 100%), #FFCC70, #C850C0, #4158D0) no-repeat 0 0;
  filter: blur(.5rem);
  transform: scale(.95);
  transition: transform .5s ease-in;
}

</style>
