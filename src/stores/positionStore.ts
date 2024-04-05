import { defineStore } from 'pinia';

export const usePositionStore = defineStore('position', {
    state: () => ({
        positions: [],
    }),
    actions: {
        async fetchPositions() {
            const query = `{
                  jobCollection(order: [startDate_DESC]) {
                    items {
                      sys {
                        id
                      }
                      company
                      title
                      startDate
                      endDate
                      description {
                        json
                      }
                      description2
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
              body: JSON.stringify({ query }),
            };
        
            try {
                const response = await fetch(fetchUrl, fetchOptions).then((response) => response.json());
                // Assuming the response data is directly under response.data.jobCollection.items
                // and needs to be converted from an object to an array
                this.positions = [...response.data.jobCollection.items];
              console.log("Positions fetched:", this.positions);
              
            } catch (error) {
              console.error("Could not receive the data from Contentful:", error);
            }
        },
    },
});