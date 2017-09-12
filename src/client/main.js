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
    chemicalList: JSON.parse('[{"modeledKoc":5027,"code":5,"notes":"","cas":"83-32-9","cancerResidential":null,"chemical":"ACENAPHTHENE","cancerWorkers":null,"metal":"N","persistant":"N","volatile":"V","cancerCI":null,"hardQuotient":0.2},{"modeledKoc":2500,"code":5,"notes":"Not anticipated to be significantly mobile in soil or groundwater.  Batch tests recommended if soil leaching action level exceeded (see Advanced EHE Options tab of Surfer). Evaluate potential surface runoff hazards into aquatic habitats.","cas":"208-96-8","cancerResidential":null,"chemical":"ACENAPHTHYLENE","cancerWorkers":null,"metal":"N","persistant":"N","volatile":"V","cancerCI":null,"hardQuotient":0.2},{"modeledKoc":2.4,"code":1,"notes":"Volatile chemical. Collect soil gas data for site-specific evaluation of vapor intrusion hazards if Tier 1 action levels for this hazard exceeded (see Advanced EHE Options tab of Surfer).","cas":"67-64-1","cancerResidential":null,"chemical":"ACETONE","cancerWorkers":null,"metal":"N","persistant":"N","volatile":"V","cancerCI":null,"hardQuotient":0.2},{"modeledKoc":82020,"code":5,"notes":"Used as termiticide; dieldrin is a breakdown product.  Soil Direct Exposure action level based on noncancer HQ of 0.5.  Evaluate cumulative risk if contaminants other than dieldrin present. Run SPLP batch test if soil leaching action level exceeded.","cas":"309-00-2","cancerResidential":0.0001,"chemical":"ALDRIN","cancerWorkers":0.0001,"metal":"N","persistant":"Y","volatile":"NV","cancerCI":0.0001,"hardQuotient":0.5},{"modeledKoc":428.2,"code":3,"notes":"Potentially significant soil leaching hazard and subsequent contamination of groundwater.  Batch tests recommended if soil leaching action level exceeded (see Advanced EHE Options tab of Surfer).","cas":"834-12-8","cancerResidential":null,"chemical":"AMETRYN","cancerWorkers":null,"metal":"N","persistant":"Y","volatile":"NV","cancerCI":null,"hardQuotient":0.2},{"modeledKoc":283,"code":3,"notes":"Potentially significant soil leaching hazard and subsequent contamination of groundwater.  Batch tests recommended if soil leaching action level exceeded (see Advanced EHE Options tab of Surfer).","cas":"35572-78-2","cancerResidential":null,"chemical":"AMINO,2- DINITROTOLUENE,4,6-","cancerWorkers":null,"metal":"N","persistant":"Y","volatile":"NV","cancerCI":null,"hardQuotient":0.2}]'),
    modal: {
      display: false,
      type: '',
      content: {}
    },
    selectedChemicals: [],
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
    }],
    reportInfo: {
      siteName: '',
      siteAddress: '',
      siteId: '',
      searchDate: ''
    }
  },
  getters: {
    chemicalList: state => {
      return state.chemicalList;
    },
    modal: state => {
      return state.modal;
    },
    selectedChemicals: state => {
      return state.selectedChemicals;
    },
    toggle: state => name => {
      return _.find(state.toggles, { name });
    }
  },
  mutations: {
    selectToggleOption: (state, payload) => {
      _.find(state.toggles, { name: payload.name }).selected = payload.index;
    },
    updateModal: (state, payload) => {
      state.modal = payload;
    },
    updateSelectedChemicals: (state, payload) => {
      state.selectedChemicals = payload;
    },
    updateChemicalList: (state, payload) => {
      state.chemicalList = payload;
    }
  },
  actions: {
    hideModal: context => {
      context.commit('updateModal', {
        display: false,
        type: '',
        content: {}
      });
    },
    selectToggleOption: (context, payload) => {
      context.commit('selectToggleOption', payload);
    },
    showModal: (context, payload) => {
      context.commit('updateModal', {
        display: true,
        type: payload.type,
        content: payload.content
      });
    },
    updateSelectedChemicals: (context, payload) => {
      context.commit('updateSelectedChemicals', payload);
    },
    updateChemicalList: (context) => {
      fetch('http://localhost:7111/chemicals/', {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      }).then((res) => {
        return res.json();
      }).then((res) =>  {
        context.commit('updateChemicalList', res);
      });
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
