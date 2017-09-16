<template lang="pug">
  .box
    span.is-size-4.has-text-weight-light Chemical of concern:
      span.has-text-weight-semibold &nbsp;{{ chemical.chemical }}
    table.table.is-striped.is-fullwidth
      tbody(v-for='eal in chemicalEals(chemical.chemical).eals')
        tr
          th
          th {{ eal.label }}
          th Tier 1 Action Level
        tr(v-for='hazard in eal.hazards')
          th.has-text-danger {{ getX(hazard, eal) }}
          td(:class='hazardClass(hazard, eal)') {{ hazard.hazard }}
          td.has-text-grey-light(v-if='hazard.eal === "Site Specific"') {{ hazard.eal }}
          td(v-else) {{ hazard.eal }}
            span.is-size-7.has-text-grey &nbsp;{{ getUnit(hazard, eal) }}
    pre
      |{{ chemical }}
      |{{ chemicalEals(chemical.chemical) }}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'chemicalReport',
  props: [ 'chemical' ],
  computed: {
    ...mapGetters([ 'chemicalEals' ])
  }
};
</script>

<style lang="stylus" scoped>
</style>
