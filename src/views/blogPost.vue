<template>
  <div class="postWrapper">
    <article v-if="post">
      <div class="article-wrapper">
        <h1 class="blogTitle">{{ post.title }}</h1>
        <p class="publishedDate">
          {{ moment(post.publishedDate).format('MMMM D, YYYY') }}
        </p>
        <RichTextRenderer :document="post.content.json" />
      </div>
    </article>
    <div v-else>
      <p>Post not found.</p>
    </div>
  </div>
</template>

<script>
import { useBlogStore } from '../stores/blogStore'
import moment from 'moment'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

export default {
  name: 'BlogPost',
  props: {
    slug: String
  },
  components: {
    RichTextRenderer
  },
  computed: {
    post() {
      const blogStore = useBlogStore()
      return blogStore.getPostBySlug(this.slug)
    }
  },
  created: function () {
    this.moment = moment
  }
}
</script>

<style scoped>
.postWrapper {
  margin: 0 auto;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  background: var(--color-blog-background);
}

article {
  height: 100%;
  overflow-y: scroll;
}

.article-wrapper {
  max-width: var(--size-section-max-width);
  margin: 0 auto;
  padding: var(--size-section-spacing);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  width: 100%;
  color: var(--color-blog-card-text);
}

.blogTitle {
  font-size: var(--font-size-header-title);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blog-card-title);
  margin-bottom: var(--size-space-07);
}

.publishedDate {
  font-size: var(--font-size-date);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blog-card-text);
  opacity: 0.64;
  margin-bottom: var(--size-component-spacing-base);
}
</style>
