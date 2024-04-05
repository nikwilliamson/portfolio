import { defineStore } from 'pinia';

export const useBlogStore = defineStore('blog', {
    state: () => ({
        blogPosts: [],
    }),
    actions: {
        
        async fetchBlogPosts() {
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
               }`

            const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${import.meta.env.VITE_APP_CONTENTFUL_SPACE_ID
                }`
            const fetchOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_APP_CONTENTFUL_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query
                })
            }

            
            
            try {
                const response = await fetch(fetchUrl, fetchOptions).then((response) => response.json());

                this.blogPosts = [...response.data.minimalBlogPostCollection.items];
              console.log("Positions fetched:", this.blogPosts);
              
            } catch (error) {
              console.error("Could not receive the data from Contentful:", error);
            }
        },
        getPostBySlug(slug) {
            return this.blogPosts.find(post => post.slug === slug);
          } 
    },
}
);