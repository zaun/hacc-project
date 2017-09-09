// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import _ from 'lodash';

Vue.config.productionTip = false;
Vue.use(Vuex);

/* Let's FLUX! Here be our global store */
const store = new Vuex.Store({
  state: {
    toggles: [{
      name: 'Land use',
      selected: 0,
      0: 'Unrestricted',
      1: 'Commercial/Industrial only'
    }, {
      name: 'Groundwater utility',
      selected: 0,
      0: 'Drinking water resource',
      1: 'Nondrinking water resource'
    }, {
      name: 'Distance to nearest surface water body',
      selected: 0,
      0: '150 meters or less',
      1: 'More than 150 meters'
    }, {
      name: 'Select contaminant by',
      selected: 0,
      0: 'Chemical name',
      1: 'CAS Number'
    }]
  },
  getters: {
    toggle: state => name => {
      return _.find(state.toggles, { name });
    }
  },
  mutations: {
    selectToggleOption: (state, payload) => {
      _.find(state.toggles, { name: payload.name }).selected = payload.index;
    }
  },
  actions: {
    selectToggleOption: (context, payload) => {
      context.commit('selectToggleOption', payload);
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
