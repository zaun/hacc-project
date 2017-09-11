<template lang="pug">
  .column.is-half-desktop
    .card
      header.card-header
        p.card-header-title {{ chemical.chemical }}
          span.has-text-grey-light &nbsp;({{ chemical.cas }})
      .card-content
        .content
          .title.is-5.has-text-centered Final EALs
          .columns.has-text-centered
            .column.is-one-third
              .is-size-6.has-text-grey Soil
              .is-size-4.has-text-primary {{ chem.soil.toExponential(1) }}
              .is-size-7.has-text-grey-light mg/kg
            .column.is-one-third
              .is-size-6.has-text-grey Groundwater
              .is-size-4.has-text-primary {{ chem.groundwater.toExponential(1) }}
              .is-size-7.has-text-grey-light ug/L
            .column.is-one-third
              .is-size-6.has-text-grey Soil Vapor
              .is-size-4.has-text-primary {{ chem.vapor.toExponential(1) }}
              .is-size-7.has-text-grey-light ug/m3
          .message.is-small.is-danger(v-if='ealExceeded')
            .message-body {{ errorMessage }}
          .title.is-5.has-text-centered Enter site data
          .columns.has-text-centered
            .column.is-one-third
              .field
                .control
                  input.input.is-info.has-text-centered(
                    type='text'
                    placeholder='Soil'
                    v-model='site.soil'
                    :class='inputClass(chem.soil, site.soil)')
              .is-size-7.has-text-grey-light mg/kg
            .column.is-one-third
              .field
                .control
                  input.input.is-info.has-text-centered(
                    type='text'
                    placeholder='Groundwater'
                    v-model='site.groundwater'
                    :class='inputClass(chem.groundwater, site.groundwater)')
              .is-size-7.has-text-grey-light ug/L
            .column.is-one-third
              .field
                .control
                  input.input.is-info.has-text-centered(
                    type='text'
                    placeholder='Soil Vapor'
                    v-model='site.vapor'
                    :class='inputClass(chem.vapor, site.vapor)')
              .is-size-7.has-text-grey-light ug/m3
          p.warning.is-size-6.has-text-danger.has-text-centered 
      footer.card-footer
        a.card-footer-item(:class='{ "is-disabled": !ealExceeded }' @click='showDetails') View details
        a.card-footer-item(:class='{ "is-disabled": !chemical.notes.length }' @click='showNotes') View notes
</template>

<script>

export default {
  name: 'chemical',
  props: [ 'chemical' ],
  data () {
    return {
      site: {
        soil: '',
        groundwater: '',
        vapor: ''
      },
      errorMessage: 'EALs exceeded. Click \'View details\' below to identify specific environmental hazards that may be posed by contamination',
      chem: {
        soil: 9.234675,
        groundwater: 15460,
        vapor: 112385918
      }
    };
  },
  computed: {
    ealExceeded () {
      return this.site.soil > this.chem.soil ||
        this.site.groundwater > this.chem.groundwater ||
        this.site.vapor > this.chem.vapor;
    }
  },
  methods: {
    inputClass (eal, val) {
      return val > eal ? 'is-danger' : 'is-info';
    },
    showDetails () {
      if (this.ealExceeded) {
        this.$store.dispatch('showModal', {
          type: 'ealDetails',
          content: {
            chemical: this.chemical.chemical,
            eals: [{
              category: 'Soil Environmental Hazards',
              unit: 'mg/kg',
              site: this.site.soil,
              hazards: [{
                hazard: 'Direct Exposure',
                eal: 9.234675
              }, {
                hazard: 'Vapor Emissions To Indoor Air',
                eal: 10
              }, {
                hazard: 'Terrestrial Ecotoxicity',
                eal: 'Site Specific'
              }, {
                hazard: 'Gross Contamination',
                eal: 12
              }, {
                hazard: 'Leaching (threat to groundwater)',
                eal: 13
              }]
            }, {
              category: 'Groundwater Environmental Hazards',
              unit: 'ug/L',
              site: this.site.groundwater,
              hazards: [{
                hazard: 'Drinking Water (Toxicity)',
                eal: 15460
              }, {
                hazard: 'Vapor Emissions To Indoor Air',
                eal: 15461
              }, {
                hazard: 'Aquatic Ecotoxicity',
                eal: 15462
              }, {
                hazard: 'Gross Contamination',
                eal: 15463
              }]
            }, {
              category: 'Other Tier 1 EALs',
              unit: 'ug/m3',
              site: this.site.vapor,
              hazards: [{
                hazard: 'Shallow Soil Vapor',
                eal: 112385918
              }, {
                hazard: 'Indoor Air',
                eal: 112385918,
                goal: true
              }]
            }]
          }
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

a.is-disabled
  color #b5b5b5
  cursor not-allowed
</style>
