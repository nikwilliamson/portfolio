<template>
  <div class="job">
    <h4 class="company">{{ company }}</h4>
    <div class="title-wrapper">
      <h5 class="title">{{ title }}</h5>
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
  font-size: var(--font-size-90);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.title-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

h5.title {
  font-size: var(--font-size-70);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-yellow);
  flex: 1;
}

h6,
.date {
  font-size: var(--font-size-50);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  opacity: 0.64;
}

.description {
  font-size: var(--font-size-60);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  max-width: 80ch;
  width: 100%;
}

.description p + ul {
  margin-top: 2rem;
}

ul {
}

li {
  margin: 0.563rem 1.33rem;
}

li + li {margin-top: 1rem;}


@media only screen and (max-width: 1000px) {
  p {
    font-size: var(--font-size-50);
  }
  li {
    margin: 0.563rem 1rem;

    font-size: var(--font-size-50);
    line-height: var(--line-height-normal);
  }

  li p {
    font-size: var(--font-size-50);
    line-height: var(--line-height-normal);
  }
  h4.company {
    font-size: var(--font-size-60);
  }
  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}
  h5.title {
    font-size: var(--font-size-50);
  }

  h6,
  .date {
    font-size: var(--font-size-40);
  }
}
</style>
