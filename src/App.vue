<template>
  <link rel="stylesheet" href="https://use.typekit.net/msv4llb.css" />
  <meta name="theme-color" content="#170A32" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#FFCC70" media="(prefers-color-scheme: dark)" />
  <main>
    <PageHeader
      title="Hi. I'm Nik."
      subtitle="I’m a product designer with a love for design systems, all things accessibility, and well written documentation."
    />
    <JobPositions :positions="this.positions" />
  </main>
  <div class="background"></div>
</template>

<script>
import JobPositions from './components/positions.vue'
import PageHeader from './components/header.vue'
import './tokens.css'

export default {
  name: 'App',
  components: { JobPositions, PageHeader },
  data() {
    return {
      positions: []
    }
  },
  async created() {
    this.positions = await this.getPositions()

    const root = document.documentElement

    // Function to update the CSS variables based on the event
    const updatePosition = (x, y) => {
      // Convert the x and y positions to a value between 0 and 1
      let normalizedX = x / window.innerWidth
      let normalizedY = y / window.innerHeight

      // Update the CSS variables
      root.style.setProperty('--mouse-x', normalizedX)
      root.style.setProperty('--mouse-y', normalizedY)
    }

    // Handle mouse move
    document.addEventListener('mousemove', (evt) => {
      updatePosition(evt.clientX, evt.clientY)
    })

    // Handle touch start and move without preventing default behavior
    const handleTouch = (evt) => {
      if (evt.touches.length > 0) {
        // Use the first touch point
        let touch = evt.touches[0]
        updatePosition(touch.clientX, touch.clientY)
      }
    }

    document.addEventListener('touchstart', handleTouch)
    document.addEventListener('touchmove', handleTouch)
  },

  methods: {
    getPositions: async () => {
      const query = `{
            jobCollection(order: [startDate_DESC]) {
              items {
                sys {
                  id
                }
                company
                title
                startDate
                endDate
                description {
                  json
                }
                description2
              }
            }
         }`

      const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${
        import.meta.env.VITE_APP_CONTENTFUL_SPACE_ID
      }`
      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_APP_CONTENTFUL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query
        })
      }

      try {
        const response = await fetch(fetchUrl, fetchOptions).then((response) => response.json())
        console.log(response.data.jobCollection.items)
        return response.data.jobCollection.items
      } catch (error) {
        // throw new Error("Could not receive the data from Contentful!");
        console.log(error)
      }
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
  padding: 0 10vw;
  margin: 0 var(--size-gradient-border-width) 0 0;
  background: var(--color-background);
  min-height: 100vh;
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
  max-width: 80ch;
  margin: 0 auto;
}
@media only screen and (max-width: 1000px) {
  :root {
    --size-gradient-border-width: var(--size-space-03);
  }
  main {
    padding: 0 var(--size-space-07) 0 var(--size-space-08);
    margin: 0 var(--size-gradient-border-width) 0 0;
  }
}
</style>
