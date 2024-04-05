import { defineStore } from 'pinia';

interface BlogPost {
  sys: {
    id: string;
  };
  author: string;
  slug: string;
  title: string;
  publishedDate: string; // Adjust this type accordingly
  category: string;
  summary: string;
  content: {
    json: any; // Adjust this type accordingly
  };
}

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogPosts: [] as BlogPost[], // Specify the type of blogPosts
  }),
  actions: {
    async fetchBlogPosts(this: any) { // Specify the type of 'this'
      const query = `{
        minimalBlogPostCollection(order: [publishedDate_DESC], limit: 2) {
          items {
            sys {
              id
            }
            author
            slug
            title
            publishedDate
            category
            summary
            content {
              json
            }
          }
        }
      }`;

      const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${import.meta.env.VITE_APP_CONTENTFUL_SPACE_ID}`;
      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_APP_CONTENTFUL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
        }),
      };

      try {
        const response = await fetch(fetchUrl, fetchOptions).then((response) => response.json());

        this.blogPosts = [...response.data.minimalBlogPostCollection.items];
        console.log("Positions fetched:", this.blogPosts);

      } catch (error) {
        console.error("Could not receive the data from Contentful:", error);
      }
    },
    getPostBySlug(this: any, slug: string) { // Specify the type of 'this' and 'slug'
      return this.blogPosts.find((post: any) => post.slug === slug);
    },
  },
});
