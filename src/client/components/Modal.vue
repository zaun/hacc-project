<template lang="pug">
.modal(:class='{ "is-active": modal.display }')
  .modal-background(@click='hideModal')
  .modal-content
    .box#eal-details(v-if='modal.type === "ealDetails"')
      .title.is-size-4.has-text-primary {{ modal.content.chemical }}
        span &nbsp;Detailed EALs
      table.table.is-striped.is-fullwidth
        tbody(v-for='eal in modal.content.eals')
          tr
            th
            th {{ eal.category }}
            th Tier 1 Action Level
          tr(v-for='hazard in eal.hazards')
            th.has-text-danger {{ getX(hazard, eal) }}
            td(:class='hazardClass(hazard, eal)') {{ hazard.hazard }}
            td.has-text-grey-light(v-if='hazard.eal === "Site Specific"') {{ hazard.eal }}
            td(v-else) {{ hazard.eal }}
              span.is-size-7.has-text-grey &nbsp;{{ getUnit(hazard, eal) }}
    .box#chemical-note(v-if='modal.type === "chemicalNote"')
      .title.is-size-4.has-text-primary {{ modal.content.chemical }}
        span &nbsp;Notes
      p.is-size-6 {{ modal.content.notes }}
  button.modal-close.is-large(@click='hideModal')
</template>

<script>
import _ from 'lodash';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'modal',
  computed: {
    ...mapGetters([ 'modal' ])
  },
  methods: {
    ...mapActions([ 'hideModal' ]),
    getX (hazard, eal) {
      if (!hazard.goal) {
        if (eal.site > hazard.eal) return 'X';
      }
    },
    hazardClass (hazard, eal) {
      return eal.site > hazard.eal && !hazard.goal ? 'has-text-danger' : 'has-text-grey-light';
    },
    getUnit (hazard, eal) {
      if (_.isNumber(hazard.eal)) {
        return eal.unit;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.modal-content span
  font-weight normal

#eal-details .title
  margin-bottom 0

tbody tr:first-child
  height 3rem
  th
    vertical-align bottom
</style>
