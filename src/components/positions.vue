<template>
<div class="positions">
  <PageTitle title="Work experience" buttonLabel="Download"/>
  <JobPosition
    v-for="position in positions"
    v-bind:key="position.sys.id"
    v-bind:company="position.company"
    v-bind:title="position.title"
    v-bind:description="position.description2"
    v-bind:startDate="position.startDate"
    v-bind:endDate="position.endDate"
  />
</div>
</template>

<script>
import JobPosition from "./position.vue";
import PageTitle from "./pageTitle.vue";
import moment from "moment";

export default {
  
  name: "JobPositions",
  components: { JobPosition, PageTitle },
  props: {
    positions: Object,
    pageTitle: String,
    buttonLabel: String
  },
  created: function () {
    this.moment = moment;
  },
};
</script>

<style scoped>
.positions {
  padding: 6rem 10vw;
  display: grid;
  grid-row-gap: 3rem;
  box-shadow: 0 0 1rem .25rem rgba(0,0,0,0.2); 
  background: white;
  margin: 2rem 2rem 0 0;
  border-radius: 0 .1rem 0 0;
}
/* .date { grid-area: 1 / 1 / 2 / 2; }  */
/* .details { grid-area: 1 / 2 / 2 / 6; }  */
</style>
