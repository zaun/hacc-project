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
    section.section
      .container
        h1.title.is-2.has-text-grey.has-text-centered Site Scenario
        .box.is-hidden-tablet
          .columns(v-for='siteScenario in siteScenarios')
            .column
              .field
                label.label.has-text-centered {{ siteScenario.label }}
                .control
                  a.button.is-primary.is-fullwidth(
                    @click='selectScenario(siteScenario, 0)'
                    :class='scenarioButtonClass(siteScenario, 0)')
                    span {{ siteScenario[0].name }}
                .control
                  a.button.is-primary.is-fullwidth(
                    @click='selectScenario(siteScenario, 1)'
                    :class='scenarioButtonClass(siteScenario, 1)')
                    span {{ siteScenario[1].name }}
        .box.is-hidden-mobile
          .columns(v-for='siteScenario in siteScenarios')
            .column
              .field.is-horizontal
                .field-label
                  label.label {{ siteScenario.label }}
                .field-body
                  .control
                    a.button.is-primary(
                      @click='selectScenario(siteScenario, 0)'
                      :class='scenarioButtonClass(siteScenario, 0)')
                      span {{ siteScenario[0].name }}
                  .control
                    a.button.is-primary(
                      @click='selectScenario(siteScenario, 1)'
                      :class='scenarioButtonClass(siteScenario, 1)')
                      span {{ siteScenario[1].name }}

</template>

<script>
import Logo from '@/components/Logo.vue';

export default {
  name: 'home',
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
      ]
    };
  },
  methods: {
    selectScenario (siteScenario, index) {
      siteScenario.active = index;
    },
    scenarioButtonClass (siteScenario, index) {
      return {
        'is-active': siteScenario.active === index,
        'is-outlined': siteScenario.active !== index
      };
    }
  },
  components: { Logo }
};
</script>

<style lang="stylus" scoped>
.logo
  width 100%
  max-width 400px

h1.title
  margin-bottom 0
  font-weight 300

.is-hidden-tablet .field
  .control .button
    border-top-left-radius 10px
    border-top-right-radius 10px
    border-bottom-left-radius 0
    border-bottom-right-radius 0
  .control:last-child .button
    border-top-left-radius 0
    border-top-right-radius 0
    border-bottom-left-radius 10px
    border-bottom-right-radius 10px

.is-hidden-mobile .field
  .field-label
    flex-grow 3.5
  .control:first-child .button
    border-top-left-radius 20px
    border-top-right-radius 0
    border-bottom-left-radius 20px
    border-bottom-right-radius 0
  .control:last-child .button
    border-top-left-radius 0
    border-top-right-radius 20px
    border-bottom-left-radius 0
    border-bottom-right-radius 20px
</style>
