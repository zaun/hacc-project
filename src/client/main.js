import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

import App from './components/app.vue';
import Home from './components/screens/home.vue';

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '*',
    redirect: '/'
  }]
});

Vue.use(VueAnalytics, { id: '', router });

new Vue({
  router: router,
  render: (h) => h(App)
}).$mount('#app');
