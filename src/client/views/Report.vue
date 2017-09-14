<template lang="pug">
#report
  nav-bar
  .hero.is-light.is-bold
    .hero-body
      .container
        .title Tier 1 EAL Surfer Summary Report
        .subtitle Hawaiʻi DOH (Summer 2016, rev Nov 2016)
  section.section#site-info
    .columns.is-multiline
      .column.is-3
        .is-size-5.has-text-weight-bold Site Name
      .column.is-9
        .is-size-5#site-name {{ siteName }}
      .column.is-3
        .is-size-5.has-text-weight-bold Site Address
      .column.is-9
        .is-size-5#site-address {{ siteAddress }}
      .column.is-3
        .is-size-5.has-text-weight-bold Site ID Number
      .column.is-9
        .is-size-5#site-id {{ siteId }}
      .column.is-3
        .is-size-5.has-text-weight-bold EAL Search Date
      .column.is-9
        .is-size-5#search-date {{ searchDate }}
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'report',
  components: {
    NavBar,
  },
  computed: {
    siteName () { return this.$store.getters.reportInfo('siteName'); },
    siteAddress () { return this.$store.getters.reportInfo('siteAddress'); },
    siteId () { return this.$store.getters.reportInfo('siteId'); },
    searchDate () { return this.$store.getters.reportInfo('searchDate'); }
  }
};
</script>

<style lang="stylus" scoped>
#site-address
  white-space pre
</style>
