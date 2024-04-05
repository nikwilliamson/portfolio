<template>
  <div class="blogPost">
    <h4 class="blogTitle">{{ title }}</h4>
    <p class="publishedDate">
      {{ moment(publishedDate).format('MMMM YYYY') }}
    </p>
    <div class="content">
      <RichTextRenderer :document="content" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

export default {
  name: 'BlogPost',
  components: {
    RichTextRenderer
  },
  props: {
    author: String,
    title: String,
    publishedDate: String,
    category: String,
    content: Object
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

.position-wrapper {
  display: flex;
  gap: var(--size-space-03);
  margin-bottom: var(--size-space-07);
  flex-direction: column;
}

h5.position {
  font-size: var(--font-size-70);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-position);
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
  margin-top: var(--size-space-07);
}

li {
  margin: var(--size-space-01) var(--size-space-06);
}

li + li {
  margin-top: var(--size-space-05);
}

@media only screen and (max-width: 1000px) {
  p {
    font-size: var(--font-size-50);
  }
  li {
    margin: var(--size-space-03) var(--size-space-05);

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
    margin-bottom: var(--size-space-06);
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
