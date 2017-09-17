<template lang="pug">
.column.is-half-desktop
  .card(v-if='chemicalEals')
    header.card-header
      p.card-header-title {{ chemical.chemical }}
        span.has-text-grey-light &nbsp;({{ chemical.cas }})
    .card-content
      .content
        .title.is-5.has-text-centered Final EALs
        .columns.has-text-centered
          .column.is-one-third
            .is-size-6.has-text-grey Soil
            .is-size-4.has-text-primary {{ formatEal(chemicalEals.soil) }}
            .is-size-7.has-text-grey-light mg/kg
          .column.is-one-third
            .is-size-6.has-text-grey Groundwater
            .is-size-4.has-text-primary {{ formatEal(chemicalEals.groundwater) }}
            .is-size-7.has-text-grey-light ug/L
          .column.is-one-third
            .is-size-6.has-text-grey Soil Vapor
            .is-size-4.has-text-primary {{ formatEal(chemicalEals.vapor) }}
            .is-size-7.has-text-grey-light ug/m3
        .message.is-small.is-danger(v-if='ealExceeded(chemicalEals)')
          .message-body {{ errorMessage }}
        .title.is-5.has-text-centered Enter site data
        .columns.has-text-centered
          .column.is-one-third
            .field
              .control
                input.input.is-info.has-text-centered(
                  type='text'
                  placeholder='Soil'
                  v-model='soil'
                  :class='inputClass(chemicalEals.soil, soil)')
            .is-size-7.has-text-grey-light mg/kg
          .column.is-one-third
            .field
              .control
                input.input.is-info.has-text-centered(
                  type='text'
                  placeholder='Groundwater'
                  v-model='groundwater'
                  :class='inputClass(chemicalEals.groundwater, groundwater)')
            .is-size-7.has-text-grey-light ug/L
          .column.is-one-third
            .field
              .control
                input.input.is-info.has-text-centered(
                  type='text'
                  placeholder='Soil Vapor'
                  v-model='vapor'
                  :class='inputClass(chemicalEals.vapor, vapor)')
            .is-size-7.has-text-grey-light ug/m3
        p.warning.is-size-6.has-text-danger.has-text-centered
    footer.card-footer
      a.card-footer-item(
        :class='{ "is-disabled": !ealExceeded(chemicalEals) }'
        @click='showDetails') View details
      a.card-footer-item(
        :class='{ "is-disabled": !chemical.notes.length }'
        @click='showNotes') View notes
</template>

<script>
import _ from 'lodash';

export default {
  name: 'chemical',
  props: [ 'chemical' ],
  data () {
    return {
      errorMessage: 'EALs exceeded. Click \'View details\' below to identify specific environmental hazards that may be posed by contamination'
    };
  },
  computed: {
    chemicalEals () {
      // land use 0 option is unrestricted
      var unrestricted = this.$store.getters.toggle('Land use').selected === 0;
      // groundwater utility 0 option is drinking
      var drinking = this.$store.getters.toggle('Groundwater utility').selected === 0;
      // distance to water 0 option is under
      var under = this.$store.getters.toggle('Distance to nearest surface water body').selected === 0;
      var chooseEal = (hazard) => {
        if (_.has(hazard, 'unrestricted') || _.has(hazard, 'commercial')) {
          hazard.eal = unrestricted ? hazard.unrestricted : hazard.commercial;
        } else if (_.has(hazard, 'drinking') || _.has(hazard, 'nonDrinking')) {
          hazard.eal = drinking ? hazard.drinking : hazard.nonDrinking;
        } else if (_.has(hazard, 'under') || _.has(hazard, 'over')) {
          hazard.eal = under ? hazard.under : hazard.over;
        }
        if (_.isObject(hazard.eal)) {
          if (_.has(hazard.eal, 'under') || _.has(hazard.eal, 'over')) {
            hazard.eal = under ? hazard.eal.under : hazard.eal.over;
          } else if (_.has(hazard.eal, 'exposed') || _.has(hazard.eal, 'isolated')) {
            // current surfer compiler always chooses exposed
            hazard.eal = hazard.eal.exposed;
          }
        }
        return hazard;
      };

      var detailedEals = this.$store.getters.chemicalEals(this.chemical.chemical);
      if (!detailedEals) {
        return;
      }

      var soil = _.chain(detailedEals.eals)
        .find({ category: 'soil' })
        .get('hazards')
        .map(function (hazard) {
          return chooseEal(hazard);
        })
        .reject(function (hazard) {
          return !_.isNumber(hazard.eal) || hazard.goal;
        })
        .minBy('eal')
        .get('eal')
        .value();
      var groundwater = _.chain(detailedEals.eals)
        .find({ category: 'groundwater' })
        .get('hazards')
        .map(function (hazard) {
          return chooseEal(hazard);
        })
        .reject(function (hazard) {
          return !_.isNumber(hazard.eal) || hazard.goal;
        })
        .minBy('eal')
        .get('eal')
        .value();
      var vapor = _.chain(detailedEals.eals)
        .find({ category: 'vapor' })
        .get('hazards')
        .map(function (hazard) {
          return chooseEal(hazard);
        })
        .reject(function (hazard) {
          return !_.isNumber(hazard.eal) || hazard.goal;
        })
        .minBy('eal')
        .get('eal')
        .value();
      return { soil, groundwater, vapor };
    },
    soil: {
      get () {
        var detailedEals = this.$store.getters.chemicalEals(this.chemical.chemical);
        return _.find(detailedEals.eals, { category: 'soil' }).site;
      },
      set (value) {
        this.$store.dispatch('updateEal', {
          chemical: this.chemical.chemical,
          category: 'soil',
          eal: value
        });
      }
    },
    groundwater: {
      get () {
        var detailedEals = this.$store.getters.chemicalEals(this.chemical.chemical);
        return _.find(detailedEals.eals, { category: 'groundwater' }).site;
      },
      set (value) {
        this.$store.dispatch('updateEal', {
          chemical: this.chemical.chemical,
          category: 'groundwater',
          eal: value
        });
      }
    },
    vapor: {
      get () {
        var detailedEals = this.$store.getters.chemicalEals(this.chemical.chemical);
        return _.find(detailedEals.eals, { category: 'vapor' }).site;
      },
      set (value) {
        this.$store.dispatch('updateEal', {
          chemical: this.chemical.chemical,
          category: 'vapor',
          eal: value
        });
      }
    }
  },
  methods: {
    inputClass (eal, val) {
      return val > eal ? 'is-danger' : 'is-info';
    },
    ealExceeded (chemicalEals) {
      return this.soil > chemicalEals.soil ||
        this.groundwater > chemicalEals.groundwater ||
        this.vapor > chemicalEals.vapor;
    },
    formatEal (eal) {
      return _.isNumber(eal) ? eal.toExponential(1) : eal;
    },
    showDetails () {
      if (this.ealExceeded(this.chemicalEals)) {
        this.$store.dispatch('showModal', {
          type: 'ealDetails',
          content: _.assign({
            chemical: this.chemical.chemical
          }, this.$store.getters.chemicalEals(this.chemical.chemical))
        });
      }
    },
    showNotes () {
      if (this.chemical.notes.length) {
        this.$store.dispatch('showModal', {
          type: 'chemicalNote',
          content: {
            chemical: this.chemical.chemical,
            notes: this.chemical.notes
          }
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.title
  margin-bottom 0.5rem

.card-content
  padding-bottom 0

.card-header-title
  span
    white-space nowrap

a.is-disabled
  color #b5b5b5
  cursor not-allowed
</style>
