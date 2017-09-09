<template lang="pug">
  #home
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
        h1.title.is-2.has-text-grey.has-text-centered Site Scenario
        .box
          toggle(v-for='scenario in scenarios' :name='scenario' :key='scenario')
    section.section#select-contaminants
      .container
        h1.title.is-2.has-text-grey.has-text-centered Select Contaminant(s)
        .box
          toggle(name='Select contaminant by')
          select-contaminants
</template>

<script>
import Logo from '@/components/Logo.vue';
import SelectContaminants from '@/components/SelectContaminants.vue';
import Toggle from '@/components/Toggle.vue';

export default {
  name: 'home',
  components: {
    Logo,
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
  }
};
</script>

<style lang="stylus" scoped>
.logo
  width 100%
  max-width 400px

h1.title
  margin-bottom 0
  font-weight 300

#site-scenario
  padding-bottom 0
</style>
