import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/home.vue';

function keepDefaultView(to, from) {
  if (from.matched.length) {
    to.matched[0].components.default = from.matched[0].components.default;
  } else {
    to.matched[0].components.default = () => import('../views/home.vue');
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    name: 'blog', 
    path: '/blog/:slug', // Correct path for dynamic segments
    components: {
      blog: () => import('../views/blogPost.vue'), // Correctly using named views
    },
    props: {
      blog: true,
    },
    beforeEnter: [keepDefaultView], // Keeping your custom navigation guard logic
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
