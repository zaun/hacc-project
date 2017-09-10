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
          toggle(v-for='scenario in scenarios' :name='scenario' :key='scenario')
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
          chemical(v-for='selectedChemical in selectedChemicals' :chemical='selectedChemical' :key='selectedChemical.cas')
</template>

<script>
import Chemical from '@/components/Chemical.vue';
import Logo from '@/components/Logo.vue';
import Modal from '@/components/Modal.vue';
import SelectContaminants from '@/components/SelectContaminants.vue';
import Toggle from '@/components/Toggle.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    Chemical,
    Logo,
    Modal,
    SelectContaminants,
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
    ...mapGetters([ 'selectedChemicals' ])
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
