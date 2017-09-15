// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import Config from 'vue-config';
import App from './App';
import router from './router';
import _ from 'lodash';

Vue.config.productionTip = false;

var appConfig = {
  API: process.env.API_URL
};

Vue.use(Vuex);
Vue.use(Config, appConfig);

const template = {
  eals: [{
    category: 'soil',
    label: 'Soil Environmental Hazards',
    site: null,
    unit: 'mg/kg',
    hazards: [{
      hazard: 'Direct Exposure',
      eal: 15
    }, {
      hazard: 'Vapor Emissions To Indoor Air',
      eal: 16
    }, {
      hazard: 'Terrestrial Ecotoxicity',
      eal: 'Site Specific'
    }, {
      hazard: 'Gross Contamination',
      eal: 17
    }, {
      hazard: 'Leaching (threat to groundwater)',
      eal: 18
    }]
  }, {
    category: 'groundwater',
    label: 'Groundwater Environmental Hazards',
    site: null,
    unit: 'ug/L',
    hazards: [{
      hazard: 'Drinking Water (Toxicity)',
      eal: 15
    }, {
      hazard: 'Vapor Emissions To Indoor Air',
      eal: 16
    }, {
      hazard: 'Aquatic Ecotoxicity',
      eal: 17
    }, {
      hazard: 'Gross Contamination',
      eal: 18
    }]
  }, {
    category: 'vapor',
    label: 'Other Tier 1 EALs',
    site: null,
    unit: 'ug/m3',
    hazards: [{
      hazard: 'Shallow Soil Vapor',
      eal: 15
    }, {
      hazard: 'Indoor Air',
      eal: 14,
      goal: true
    }]
  }]
};

/* Let's FLUX! Here be our global store */
const store = new Vuex.Store({
  state: {
    chemicalList: JSON.parse('[{"modeledKoc":5027,"code":5,"notes":"","cas":"83-32-9","cancerResidential":null,"chemical":"ACENAPHTHENE","cancerWorkers":null,"metal":"N","persistant":"N","volatile":"V","cancerCI":null,"hardQuotient":0.2},{"modeledKoc":2500,"code":5,"notes":"Not anticipated to be significantly mobile in soil or groundwater.  Batch tests recommended if soil leaching action level exceeded (see Advanced EHE Options tab of Surfer). Evaluate potential surface runoff hazards into aquatic habitats.","cas":"208-96-8","cancerResidential":null,"chemical":"ACENAPHTHYLENE","cancerWorkers":null,"metal":"N","persistant":"N","volatile":"V","cancerCI":null,"hardQuotient":0.2},{"modeledKoc":2.4,"code":1,"notes":"Volatile chemical. Collect soil gas data for site-specific evaluation of vapor intrusion hazards if Tier 1 action levels for this hazard exceeded (see Advanced EHE Options tab of Surfer).","cas":"67-64-1","cancerResidential":null,"chemical":"ACETONE","cancerWorkers":null,"metal":"N","persistant":"N","volatile":"V","cancerCI":null,"hardQuotient":0.2}]'),
    chemicalDetail: {},
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
    },
    eals: {
      'ACENAPHTHENE': _.cloneDeep(template),
      'ACENAPHTHYLENE': _.cloneDeep(template),
      'ACETONE': _.cloneDeep(template)
    }
  },
  getters: {
    chemicalEals: state => chemical => {
      return state.eals[chemical];
    },
    chemicalList: state => {
      return state.chemicalList;
    },
    modal: state => {
      return state.modal;
    },
    reportInfo: state => prop => {
      if (prop) return state.reportInfo[prop];
      else return state.reportInfo;
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
      state.selectedChemicals = _.cloneDeep(payload);
    },
    updateChemicalList: (state, payload) => {
      state.chemicalList = payload;
    },
    updateChemicalDetail: (state, payload) => {
      state.chemicalDetail[payload.chemical] = payload.detail;
      console.log(state.chemicalDetail);
    },
    updateReportInfo: (state, payload) => {
      state.reportInfo[payload.prop] = payload.value;
    },
    updateEal: (state, payload) => {
      var eal = _.find(state.eals[payload.chemical].eals, { category: payload.category });
      var siteEal = _.toNumber(payload.eal);
      if (!_.isNaN(siteEal)) {
        eal.site = siteEal;
      }
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
      var selectedChemicals = context.state.selectedChemicals;
      var newChemicals = _.differenceWith(payload, selectedChemicals, function (a, b) {
        return a.chemical === b.chemical;
      });

      context.commit('updateSelectedChemicals', payload);

      _.each(newChemicals, (chemical) => {
        context.dispatch('getChemicalDetail', chemical.chemical);
      });
    },
    updateReportInfo: (context, payload) => {
      context.commit('updateReportInfo', payload);
    },
    updateEal: (context, payload) => {
      context.commit('updateEal', payload);
    },
    updateChemicalList: (context) => {
      fetch(appConfig.API + '/chemicals/', {
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      }).then((res) => {
        return res.json();
      }).then((res) => {
        context.commit('updateChemicalList', res);
      });
    },
    getChemicalDetail: (context, payload) => {
      fetch(appConfig.API + '/detail/', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*'
        },
        body: payload
      }).then((res) => {
        return res.json();
      }).then((res) => {
        context.commit('updateChemicalDetail', {
          chemical: payload,
          detail: res
        });
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
