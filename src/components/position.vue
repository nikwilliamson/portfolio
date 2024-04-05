<template>
  <div class="job">
    <h4 class="company">{{ company }}</h4>
    <div class="position-wrapper">
      <h5 class="position">{{ title }}</h5>
      <p class="date" v-if="endDate">
        {{ moment(startDate).format('MMMM YYYY') }} – {{ moment(endDate).format('MMMM YYYY') }}
      </p>
      <p class="date" v-else>{{ moment(startDate).format('MMMM YYYY') }} – Present</p>
    </div>
    <div class="description">
      <RichTextRenderer :document="description" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

export default {
  name: 'JobPosition',
  components: {
    RichTextRenderer
  },
  props: {
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    description2: String,
    description: Object
  },

  data() {
    return {
      document
    }
  },

  created: function () {
    this.moment = moment
  }
}
</script>

<style>
.job {
  display: grid;
  grid-template-rows: 1fr;
}

h4.company {
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.position-wrapper {
  display: flex;
  gap: var(--size-component-spacing-tight);
  margin-bottom: var(--size-component-spacing-loose);
  flex-direction: column;
}

h5.position {
  font-size: var(--font-size-subtitle);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-position);
  flex: 1;
}

h6,
.date {
  font-size: var(--font-size-date);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  opacity: 0.64;
}

.description {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  width: 100%;
}

.description p + ul {
  margin-top: var(--size-component-spacing-loose);
}

li {
  margin: var(--size-space-01) var(--size-space-06);
}

li + li {
  margin-top: var(--size-component-spacing-base);
}

</style>
