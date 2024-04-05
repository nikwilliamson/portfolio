<template>
  <main :class="{ 'blog-active': $route.name === 'blog'}">
    <PageHeader
      title="Hi. I'm Nik."
      subtitle="I’m a product designer with a love for design systems, all things accessibility, and well written documentation."
    />

    <BlogPosts :blogPosts="blogPosts" />
    <JobPositions :positions="positions" />
  </main>
  <div class="background"></div>
</template>

<script>
import { onMounted } from 'vue'
import { ref } from 'vue'
import JobPositions from '../components/positions.vue'
import PageHeader from '../components/header.vue'
import BlogPosts from '../components/blogPosts.vue'
import { useBlogStore } from '../stores/blogStore'
import { usePositionStore } from '../stores/positionStore' // Import the position store

export default {
  name: 'Home',
  components: { JobPositions, PageHeader, BlogPosts },
  setup() {
    const blogStore = useBlogStore()
    const positionStore = usePositionStore()

    // Define reactive properties for blogPosts and positions
    const blogPosts = ref([])
    const positions = ref([])

    onMounted(async () => {
      // Wait for both fetch operations to complete
      await Promise.all([blogStore.fetchBlogPosts(), positionStore.fetchPositions()])

      // Update the reactive properties with the fetched data
      blogPosts.value = blogStore.blogPosts
      positions.value = positionStore.positions
    })

    // Return the reactive properties
    return {
      blogPosts,
      positions
    }
  }
}
</script>

<style>
* {
  font-family: 'proxima-nova', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--color-text);
}
html {
  font-size: var(--font-size-base);
}
body {
  background: var(--color-background);
}
::-moz-selection {
  /* Code for Firefox */
  color: var(-color-text);
  background: var(--color-highlight);
}

::selection {
  color: var(-color-text);
  background: var(--color-highlight);
}
main {
  display: grid;
  margin: 0 var(--size-gradient-border-width);
  background: var(--color-background);
  min-height: 100vh;
}

main.blog-active {
  overflow: hidden;
  position: absolute;
  inset: 0;
}

.background {
  width: var(--size-gradient-border-width);
  position: fixed;
  background: transparent
    radial-gradient(
      circle at calc(var(--mouse-x, 0) * 100%) calc(var(--mouse-y, 0) * 100%),
      var(--color-yellow),
      var(--color-pink),
      var(--color-blue)
    )
    no-repeat 0 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}


header,
section {
  margin: 0 auto;
}
@media only screen and (max-width: 1000px) {
  main {
    
    margin: 0 var(--size-gradient-border-width) 0 0;
  }
}
</style>
