<template>
  <section class="blogList">
    <PageTitle title="Thoughts" />
    <div class="blogPosts">
      <BlogPostCard
        v-for="blogPost in blogPosts"
        v-bind:key="blogPost.sys.id"
        v-bind:slug="blogPost.slug"
        v-bind:author="blogPost.author"
        v-bind:title="blogPost.title"
        v-bind:summary="blogPost.summary"
        v-bind:content="blogPost.content.json"
        v-bind:publishedDate="blogPost.publishedDate"
        v-bind:category="blogPost.category"
      />
    </div>
  </section>
</template>

<script>
import BlogPostCard from './blogPostCard.vue'
import PageTitle from './pageTitle.vue'
import moment from 'moment'

export default {
  name: 'BlogList',
  components: { BlogPostCard, PageTitle },
  props: {
    blogPosts: Object,
    pageTitle: String,
    buttonLabel: String
  },
  created: function () {
    this.moment = moment
  }
}
</script>

<style scoped>
.blogList {
  --color-title: var(--color-blog-card-title);

  background-color: var(--color-blog-background);
  width: 100%;
  display: flex;
  padding: var(--size-section-spacing);
  flex-direction: column;
}

.blogPosts {
  margin: 0 auto;
  max-width: var(--size-section-max-width);
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: calc(8 * var(--font-size-base));
}

@media (max-width: 1000px) {

  .blogPosts {
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: calc(4 * var(--font-size-base));
  }
}
</style>
