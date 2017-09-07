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
    site-scenarios(:scenarios='siteScenarios')
    select-contaminants(:options='contaminantOptions')
</template>

<script>
import Logo from '@/components/Logo.vue';
import SelectContaminants from '@/components/SelectContaminants.vue';
import SiteScenarios from '@/components/SiteScenarios.vue';

export default {
  name: 'home',
  components: {
    Logo,
    SelectContaminants,
    SiteScenarios
  },
  data () {
    return {
      siteScenarios: [
        {
          label: 'Land use',
          active: 0,
          0: { name: 'Unrestricted' },
          1: { name: 'Commercial/Industrial only' }
        },
        {
          label: 'Groundwater utility',
          active: 0,
          0: { name: 'Drinking water resource' },
          1: { name: 'Nondrinking water resource' }
        },
        {
          label: 'Distance to nearest surface water body',
          active: 0,
          0: { name: 'Under 150 meters' },
          1: { name: '150 meters or more' }
        }
      ],
      contaminantOptions: {
        label: 'Select contaminant by',
        active: 0,
        0: { name: 'Chemical name' },
        1: { name: 'CAS Number' }
      }
    };
  }
};
</script>

<style lang="stylus" scoped>
.logo
  width 100%
  max-width 400px
</style>
