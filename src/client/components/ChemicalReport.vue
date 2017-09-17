<template lang="pug">
  .box.page-break
    div.is-size-4.has-text-weight-light Chemical of concern:
      span.has-text-weight-semibold &nbsp;{{ chemical.chemical }}
    div.notes-title.is-size-5.has-text-weight-light Notes:
    div.notes.is-size-6.has-text-weight-light {{ chemical.notes }}
    .columns
      .column.has-text-centered
        .icon.is-large.has-text-success
          i.fa.fa-globe
        span.has-text-success Soil: &nbsp;
        span.has-text-black {{ getSite('soil') }}
      .column.has-text-centered
        .icon.is-large.has-text-info
          i.fa.fa-tint
        span.has-text-info Groundwater: &nbsp;
        span.has-text-black {{ getSite('groundwater') }}
      .column.has-text-centered
        .icon.is-large.has-text-grey-light
          i.fa.fa-cloud
        span.has-text-grey-light Soil Vapor: &nbsp;
        span.has-text-black {{ getSite('vapor') }}
    table.table.is-striped.is-fullwidth
      tbody(v-for='eal in chemicalEals(chemical.chemical).eals')
        tr
          th {{ eal.label }}
          th Tier 1 Action Level
          th Potential Hazard?
        tr(v-for='hazard in eal.hazards')
          td {{ hazard.hazard }}
          td(v-if='isNumber(hazard.eal)') {{ hazard.eal }}
            span.is-size-7.has-text-grey &nbsp;{{ getUnit(hazard, eal) }}
          td.has-text-grey(v-else) {{ hazard.eal || '-' }}
          td {{ getPotentialHazard(hazard, eal) }}
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'chemicalReport',
  props: [ 'chemical' ],
  computed: {
    ...mapGetters([ 'chemicalEals' ])
  },
  methods: {
    getPotentialHazard (hazard, eal) {
      if (_.isNumber(hazard.eal) && !hazard.goal) {
        return eal.site > hazard.eal ? 'Yes' : 'No';
      }
      return '-';
    },
    getUnit (hazard, eal) {
      if (_.isNumber(hazard.eal)) {
        return eal.unit;
      }
    },
    isNumber (eal) {
      return _.isNumber(eal);
    },
    getSite (ealName) {
      var eals = this.chemicalEals(this.chemical.chemical).eals;
      var eal = _.find(eals, { category: ealName });
      if (eal) {
        if (eal.site) {
          return eal.site;
        } else {
          return '-';
        }
      } else {
        return '-';
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.notes-title
  float left

.notes
  padding-top 4px
  padding-left 4em

@media print
  .box
    margin-top 15mm
</style>
