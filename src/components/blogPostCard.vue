<template>
  <div class="blogPostCard">
    <h4 class="blogTitle">
      <router-link :to="`/blog/${slug}`">{{ title }}</router-link>
    </h4>
    <div class="content">
      <p class="publishedDate">
        {{ moment(publishedDate).format('MMMM D, YYYY') }}
      </p>
      <p class="summary">
        {{ summary }}
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

export default {
  name: 'BlogPostCard',
  components: {
    RichTextRenderer
  },
  props: {
    author: String,
    title: String,
    slug: String,
    publishedDate: String,
    category: String,
    summary: String
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

<style scoped>
.blogPostCard {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-06);
}
.content {
  display: flex;
  flex-direction: column;
  gap: var(--size-component-spacing-tight);
}

h4.blogTitle a {
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blog-card-title);
}

a {
  text-decoration: underline;
  transition: .1s ease-out text-decoration-color;
  text-decoration-color: var(--color-yellow);
}

a:hover{
  text-decoration-color: var(--color-background);
}

.position-wrapper {
  display: flex;
  gap: var(--size-component-spacing-tight);
  margin-bottom: var(--size-component-spacing-loose);
  flex-direction: column;
}

.summary {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  width: 100%;
  color: var(--color-blog-card-text);
}

.publishedDate {
  font-size: var(--font-size-date);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blog-card-text);
  opacity: 0.64;
}

</style>
