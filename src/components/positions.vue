<template>
  <div class="positions">
    <PageTitle title="Experience" />
    <div class="jobs">
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
  </div>
</template>

<script>
import JobPosition from './position.vue'
import PageTitle from './pageTitle.vue'
import moment from 'moment'

export default {
  name: 'JobPositions',
  components: { JobPosition, PageTitle },
  props: {
    positions: Object,
    pageTitle: String,
    buttonLabel: String
  },
  created: function () {
    this.moment = moment
  }
}
</script>

<style scoped>
.jobs {
  display: grid;
  grid-row-gap: calc(8 * var(--font-size-base));
  margin-bottom: 8rem;
}
@media (max-width: 1000px) {
  .jobs {
    display: grid;
    grid-row-gap: calc(4 * var(--font-size-base));
  }
}
/* .date { grid-area: 1 / 1 / 2 / 2; }  */
/* .details { grid-area: 1 / 2 / 2 / 6; }  */
</style>
