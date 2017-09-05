import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Update from '@/views/Update';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/update',
      name: 'Update',
      component: Update
    }
  ]
});
