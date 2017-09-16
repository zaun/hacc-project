import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Update from '@/views/Update';
import Report from '@/views/Report';

Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/update',
      name: 'Update',
      component: Update
    }, {
      path: '/report',
      name: 'Report',
      component: Report
    }
  ]
});

router.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0);
  next();
});

export default router;
