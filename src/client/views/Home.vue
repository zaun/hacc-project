<template lang="pug">
#home
  modal
  .hero.is-primary
    .hero-body
      .container
        .columns.is-mobile
          .column
          .column.is-half-mobile.is-one-third-tablet.is-one-quarter-desktop
            logo(hero)
          .column
  section.section#site-scenario
    .container
      .title.is-2.has-text-grey Site Scenario
      .box
        toggle(
          v-for='scenario in scenarios'
          :name='scenario'
          :key='scenario')
  section.section#select-contaminants
    .container
      .title.is-2.has-text-grey Select Contaminant(s)
      .box
        toggle(name='Select contaminant by')
        select-contaminants
  section.section#final-eals
    .container
      .title.is-2.has-text-grey Environmental Action Levels (EALs)
      .box(v-if='!selectedChemicals.length')
        .subtitle.is-4.has-text-grey-light.has-text-centered No contaminants selected
      .columns.is-multiline.is-desktop
        chemical(
          v-for='selectedChemical in selectedChemicals'
          :chemical='selectedChemical'
          :key='selectedChemical.cas')
  section.section#generate-report
    .container
      .title.is-2.has-text-grey Generate Summary Report
      .box
        site-input(type='text' label='Site Name' v-model='siteName')
        site-input(type='textarea' label='Site Address' v-model='siteAddress')
        site-input(type='text' label='Site ID Number' v-model='siteId')
        site-input(type='datepicker' label='Date of EAL Search')
        .has-text-centered
          router-link.button.is-large.is-primary(to='/report') Generate Report
</template>

<script>
import Chemical from '@/components/Chemical.vue';
import Logo from '@/components/Logo.vue';
import Modal from '@/components/Modal.vue';
import SelectContaminants from '@/components/SelectContaminants.vue';
import SiteInput from '@/components/SiteInput.vue';
import Toggle from '@/components/Toggle.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    Chemical,
    Logo,
    Modal,
    SelectContaminants,
    SiteInput,
    Toggle
  },
  data () {
    return {
      scenarios: [
        'Land use',
        'Groundwater utility',
        'Distance to nearest surface water body'
      ]
    };
  },
  computed: {
    ...mapGetters([ 'selectedChemicals' ]),
    siteName: {
      get () { return this.$store.getters.reportInfo('siteName'); },
      set (value) { this.$store.dispatch('updateReportInfo', { prop: 'siteName', value }); }
    },
    siteAddress: {
      get () { return this.$store.getters.reportInfo('siteAddress'); },
      set (value) { this.$store.dispatch('updateReportInfo', { prop: 'siteAddress', value }); }
    },
    siteId: {
      get () { return this.$store.getters.reportInfo('siteId'); },
      set (value) { this.$store.dispatch('updateReportInfo', { prop: 'siteId', value }); }
    }
  },
  created () {
    this.$store.dispatch('updateChemicalList');
  }
};
</script>

<style lang="stylus" scoped>
.logo
  width 100%
  max-width 400px

#home section
  padding-bottom 0
  .title
    margin-bottom 0
    font-weight 300

#home section:last-child
  padding-bottom 3rem

#final-eals .subtitle
  margin-top 3rem
  margin-bottom 3rem
</style>
