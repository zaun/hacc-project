<template lang="pug">
#report
  nav-bar
  .hero.is-info.is-bold
    .hero-body
      .container
        .title Tier 1 EAL Surfer Summary Report
        .subtitle Hawaiʻi DOH (Summer 2016, rev Nov 2016)
  section.section#site-info
    .container
      .columns
        .column.is-3
          .is-size-5.has-text-weight-bold Site Name
        .column.is-9
          .is-size-5#site-name(v-if='siteName') {{ siteName }}
          .is-size-5.has-text-grey-light#site-name(v-else) No site name entered
      .columns
        .column.is-3
          .is-size-5.has-text-weight-bold Site Address
        .column.is-9
          .is-size-5#site-address(v-if='siteAddress') {{ siteAddress }}
          .is-size-5.has-text-grey-light#site-address(v-else) No site address entered
      .columns
        .column.is-3
          .is-size-5.has-text-weight-bold Site ID Number
        .column.is-9
          .is-size-5#site-id(v-if='siteId') {{ siteId }}
          .is-size-5.has-text-grey-light#site-id(v-else) No site ID number entered
      .columns
        .column.is-3
          .is-size-5.has-text-weight-bold EAL Search Date
        .column.is-9
          .is-size-5#search-date(v-if='searchDate') {{ searchDate }}
          .is-size-5.has-text-grey-light#search-date(v-else) No search date entered
  section.section#selected-scenarios
    .container
      .title.is-2.has-text-grey Selected Site Scenario
      .box.is-hidden-tablet
        .selected-scenario
          .icon.is-large.has-text-success
            i.fa.fa-2x.fa-home
          .selected-scenario-text
            h1.title.is-6.has-text-weight-light Land Use
            h1.title.is-5.has-text-weight-semibold {{ landUse }}
        .selected-scenario
          .icon.is-large.has-text-info
            i.fa.fa-2x.fa-tint
          .selected-scenario-text
            h1.title.is-6.has-text-weight-light Groundwater utility
            h1.title.is-5.has-text-weight-semibold {{ groundwaterUtility }}
        .selected-scenario
          .icon.is-large.has-text-primary
            i.fa.fa-2x.fa-map-marker
          .selected-scenario-text
            h1.title.is-6.has-text-weight-light Distance To Nearest Surface Water Body
            h1.title.is-5.has-text-weight-semibold {{ waterDistance }}
      .box.is-hidden-mobile
        .columns
          .column.is-4
            .icon.is-large.has-text-success
              i.fa.fa-2x.fa-home
          .column.is-4
            .icon.is-large.has-text-info
              i.fa.fa-2x.fa-tint
          .column.is-4
            .icon.is-large.has-text-primary
              i.fa.fa-2x.fa-map-marker
        .columns
          .column.is-4.is-paddingless
            h1.title.is-6.has-text-weight-light Land Use
          .column.is-4.is-paddingless
            h1.title.is-6.has-text-weight-light Groundwater utility
          .column.is-4.is-paddingless
            h1.title.is-6.has-text-weight-light Distance To Nearest Surface Water Body
        .columns
          .column.is-4
            h1.title.is-5.has-text-weight-semibold {{ landUse }}
          .column.is-4
            h1.title.is-5.has-text-weight-semibold {{ groundwaterUtility }}
          .column.is-4
            h1.title.is-5.has-text-weight-semibold {{ waterDistance }}

  .page-break
  section.section#report-summary
    .container
      .title.is-2.has-text-grey Summary of
        span.has-text-danger &nbsp;Exceeded
        span &nbsp;EALs
      report-summary

  .page-break
  section.section#chemical-reports
    .container
      .title.is-2.has-text-grey.screen-only Detailed Contaminant Reports
      .box(v-if='!selectedChemicals.length')
        .subtitle.is-4.has-text-grey-light.has-text-centered No contaminants selected
      chemical-report(
        v-for='selectedChemical in selectedChemicals'
        :chemical='selectedChemical'
        :key='selectedChemical.cas')
</template>

<script>
import ChemicalReport from '@/components/ChemicalReport.vue';
import NavBar from '@/components/NavBar.vue';
import ReportSummary from '@/components/ReportSummary.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'report',
  components: {
    ChemicalReport,
    NavBar,
    ReportSummary
  },
  computed: {
    ...mapGetters([ 'selectedChemicals' ]),
    landUse () {
      var landUse = this.$store.getters.toggle('Land use');
      return landUse[landUse.selected];
    },
    groundwaterUtility () {
      var groundwaterUtility = this.$store.getters.toggle('Groundwater utility');
      return groundwaterUtility[groundwaterUtility.selected];
    },
    waterDistance () {
      var waterDistance = this.$store.getters.toggle('Distance to nearest surface water body');
      return waterDistance[waterDistance.selected];
    },
    siteName () { return this.$store.getters.reportInfo('siteName'); },
    siteAddress () { return this.$store.getters.reportInfo('siteAddress'); },
    siteId () { return this.$store.getters.reportInfo('siteId'); },
    searchDate () {
      var searchDate = this.$store.getters.reportInfo('searchDate');
      if (searchDate) return moment(searchDate).format('MMMM D, YYYY');
      else return '';
    }
  }
};
</script>

<style lang="stylus" scoped>
section
  padding-bottom 0
  .title
    margin-bottom 0
    font-weight 300

section:last-child
  padding-bottom 3rem

#site-address
  white-space pre

#site-info
  .columns:not(:last-child)
    margin-bottom 1.75rem
  .column
    padding 0 0.75rem

#selected-scenarios .is-hidden-mobile
  .column
    display flex
    align-items center
    justify-content center
    text-align center

#selected-scenarios .is-hidden-tablet
  .selected-scenario
    display flex
    align-items center
    padding 0.5rem 0

#chemical-reports .subtitle
  margin-top 3rem
  margin-bottom 3rem

@media print
  #chemical-reports
    padding-top 0

</style>
