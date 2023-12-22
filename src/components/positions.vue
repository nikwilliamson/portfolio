<template>
<div class="positions">
  <PageTitle title="Work experience"/>
  <JobPosition
    v-for="position in positions"
    v-bind:key="position.sys.id"
    v-bind:company="position.company"
    v-bind:title="position.title"
    v-bind:description2="position.description2"
    v-bind:description="position.description.json"
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
@media (max-width: 1000px) {
 .positions {
    padding: 4rem 10vw;
    margin: 0;
    border-radius: 0;
 }
}
/* .date { grid-area: 1 / 1 / 2 / 2; }  */
/* .details { grid-area: 1 / 2 / 2 / 6; }  */
</style>
