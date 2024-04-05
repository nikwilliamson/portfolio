<template>
  <section class="positions">
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
  </section>
</template>

<script>
import JobPosition from './position.vue'
import PageTitle from './pageTitle.vue'
import moment from 'moment'

export default {
  name: 'JobPositions',
  components: { JobPosition, PageTitle },
  props: {
    positions: Array,
    pageTitle: String,
    buttonLabel: String
  },
  created: function () {
    this.moment = moment
  }
}
</script>

<style scoped>
.positions {
  width: 100%;
  margin: 0 auto;
  padding: var(--size-section-spacing);
}

.jobs {
  max-width: var(--size-section-max-width);
  display: grid;
  grid-row-gap: var(--size-section-spacing-vertical);
  margin-bottom: var(--size-component-spacing-loose);
  margin: 0 auto;
}

</style>
