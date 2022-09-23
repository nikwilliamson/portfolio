<template>
  <link rel="stylesheet" href="https://use.typekit.net/msv4llb.css" />
  <PageHeader title="Hi. I'm Nik. I design products that are easy to use." buttonLabel="Testing"/>
  <JobPositions :positions="this.positions"/>
  <!-- <JobPosition
    v-for="position in positions"
    v-bind:key="position.sys.id"
    v-bind:company="position.company"
    v-bind:title="position.title"
    v-bind:description="position.description2"
    v-bind:startDate="position.startDate"
    v-bind:endDate="position.endDate"
  /> -->
  <div class="background"></div>
</template>

<script>
import JobPositions from "./components/positions.vue";
import PageHeader from "./components/header.vue";

export default {
  name: "App",
  components: { JobPositions, PageHeader },
  data() {
    return {
      positions: [],
    };
  },
  async created() {
    this.positions = await this.getPositions();

    const root = document.documentElement;
    
    document.addEventListener('mousemove', evt => {
      
        let x = evt.clientX / innerWidth;
        let y = evt.clientY / innerHeight;
        
        root.style.setProperty('--mouse-x', x);
        root.style.setProperty('--mouse-y', y);
    });

    document.addEventListener('dragover', evt => {
      
      let x = evt.clientX / innerWidth;
      let y = evt.clientY / innerHeight;
      
      root.style.setProperty('--mouse-x', x);
      root.style.setProperty('--mouse-y', y);
  });
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
                description2
              }
            }
         }`;

      const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${process.env.VUE_APP_CONTENTFUL_SPACE_ID}`;
      const fetchOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      };

      try {
        const response = await fetch(fetchUrl, fetchOptions).then((response) =>
          response.json()
        );
        return response.data.jobCollection.items;
      } catch (error) {
        // throw new Error("Could not receive the data from Contentful!");
        console.log(error);
      }
    },
  },
};
</script>

<style>
* {
  font-family: "proxima-nova", "Helvetica Neue", Arial, Helvetica, sans-serif;
}
body { 
  background: transparent;
  margin: 0;
  padding: 0;
}
.background {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background: transparent radial-gradient(circle at calc(var(--mouse-x, 0) * 200%) calc(var(--mouse-y, 0) * 200%), #FFCC70, #C850C0, #4158D0) no-repeat 0 0;
  top: 0;
  left: 0;
  z-index: -1;

}
</style>
