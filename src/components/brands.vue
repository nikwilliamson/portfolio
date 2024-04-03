<template>
  <div class="header open">
    <svg class="logo" width="13" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.355 0 2.818.185 0 17.975l5.304-1.709L1.673 32 13 9.718l-6.251 1.886L11.355 0Z" fill="#FFCC70"/></svg>
    <div>
      <h1>{{ title }} <span>{{ highlight }}</span></h1>
      <h2>{{ subtitle }}</h2>
      <!-- <NWButton :buttonType="buttonType" :label="buttonLabel" /> -->
      <p class="email">hello@nikw.co</p>
      <div class="social">
        <a href="https://www.linkedin.com/in/nikwilliamson/"><svg data-icon="linkedin-in" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M100.3 480H7.4V180.9h92.9V480zM53.8 140.1C24.1 140.1 0 115.5 0 85.8 0 56.1 24.1 32 53.8 32c29.7 0 53.8 24.1 53.8 53.8 0 29.7-24.1 54.3-53.8 54.3zM448 480h-92.7V334.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V480h-92.8V180.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V480z"></path></svg><!-- <i class=" fa fab fa-linkedin-in"></i> --></a>
        <a href="https://twitter.com/nikwilliamson"><svg data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M443.8 159.7c.3 4.2.3 8.4.3 12.6 0 128.1-97.5 275.7-275.7 275.7-54.9 0-105.9-15.9-148.8-43.5 7.8.9 15.3 1.2 23.4 1.2 45.3 0 87-15.3 120.3-41.4-42.6-.9-78.3-28.8-90.6-67.2 6 .9 12 1.5 18.3 1.5 8.7 0 17.4-1.2 25.5-3.3-44.4-9-77.7-48-77.7-95.1V199c12.9 7.2 27.9 11.7 43.8 12.3-26.1-17.4-43.2-47.1-43.2-80.7 0-18 4.8-34.5 13.2-48.9 47.7 58.8 119.4 97.2 199.8 101.4-1.5-7.2-2.4-14.7-2.4-22.2 0-53.4 43.2-96.9 96.9-96.9 27.9 0 53.1 11.7 70.8 30.6 21.9-4.2 42.9-12.3 61.5-23.4-7.2 22.5-22.5 41.4-42.6 53.4 19.5-2.1 38.4-7.5 55.8-15-13.2 19.2-29.7 36.3-48.6 50.1z"></path></svg><!-- <i class="fa fab fa-twitter"></i> --></a>
        <a href="https://dribbble.com/nikw"><svg  data-icon="dribbble" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248 248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955-6.984-1.477-77.018-15.682-147.502-6.818-5.752-14.041-11.181-26.393-18.617-41.614 78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519-34.712-63.776-73.185-116.168-79.04-124.008 67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473 9.268.19 111.92 1.513 217.706-30.146 6.064 11.868 11.857 23.915 17.174 35.949-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756 29.74 77.283 42.039 142.053 45.189 160.638-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033 66.38-10.626 124.7 6.768 131.947 9.055-9.442 58.941-43.273 109.844-90.795 141.978z"></path></svg><!-- <i class=" fa fab fa-dribbble"></i> --></a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Brands",
    props: {
      title: String,
      highlight: String,
      subtitle: String,
      buttonLabel: String,
      buttonType: Option,
    },
    mounted() {
      setTimeout(() => {
        this.$el.classList.remove("open");
      }, 1000);
    },
  };
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
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
  .email {
    margin-top: 4rem;
    color: white;
  }
  .header {
    background: #232830;
    color: #fff;
    padding: 8rem 10vw 10rem;
    box-shadow: 0 0 1rem 0.25rem rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    animation-duration: 1.5s;
    animation-fill-mode: both;
    animation-iteration-count: initial;
    animation-name: slideDown;
    animation-delay: 1s;
  }
  
  
  h1, h2 {
    color: #c0c5ce;
    font-weight: 400;
    font-size: 1.777rem;
  }
  h1 span {color: #fff;}
  
  h2 {
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-iteration-count: initial;
    animation-name: fadeInUp;
    animation-delay: 4s;
  }
  
  .social {
    margin-top: 1rem;
  }
  
  .social a,
  .social a:visited {
    color: #fff;
    margin-right: 1rem;
    display: inline-block;
    width: 1rem;
  }
  
  .social a:hover {
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-iteration-count: initial;
    animation-name: jello;
    transform-origin: center;
  }
  @keyframes jello {
    from,
    11.1%,
    to {
      transform: none;
    }
    
    22.2% {
      transform: skewX(-12.5deg) skewY(-12.5deg);
    }
    
    33.3% {
      transform: skewX(6.25deg) skewY(6.25deg);
    }
    
    44.4% {
      transform: skewX(-3.125deg) skewY(-3.125deg);
    }
    
    55.5% {
      transform: skewX(1.5625deg) skewY(1.5625deg);
    }
    
    66.6% {
      transform: skewX(-0.78125deg) skewY(-0.78125deg);
    }
    
    77.7% {
      transform: skewX(0.390625deg) skewY(0.390625deg);
    }
    
    88.8% {
      transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }
    
    to {
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
        opacity: 0;
        transform:translate3d(0, 100%, 0)
    }

    to {
        opacity: 1;
        transform: none
    }
}
  
</style>
