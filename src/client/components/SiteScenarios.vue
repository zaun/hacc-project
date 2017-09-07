<template lang="pug">
  section.section
    .container
      h1.title.is-2.has-text-grey.has-text-centered Site Scenario
      .box.is-hidden-tablet
        .columns(v-for='scenario in scenarios')
          .column
            .field
              label.label.has-text-centered {{ scenario.label }}
              .control
                a.button.is-primary.is-fullwidth(
                  @click='selectScenario(scenario, 0)'
                  :class='scenarioButtonClass(scenario, 0)')
                  span {{ scenario[0].name }}
              .control
                a.button.is-primary.is-fullwidth(
                  @click='selectScenario(scenario, 1)'
                  :class='scenarioButtonClass(scenario, 1)')
                  span {{ scenario[1].name }}
      .box.is-hidden-mobile
        .columns(v-for='scenario in scenarios')
          .column
            .field.is-horizontal
              .field-label
                label.label {{ scenario.label }}
              .field-body
                .control
                  a.button.is-primary(
                    @click='selectScenario(scenario, 0)'
                    :class='scenarioButtonClass(scenario, 0)')
                    span {{ scenario[0].name }}
                .control
                  a.button.is-primary(
                    @click='selectScenario(scenario, 1)'
                    :class='scenarioButtonClass(scenario, 1)')
                    span {{ scenario[1].name }}
</template>

<script>
export default {
  name: 'siteScenarios',
  props: [ 'scenarios' ],
  methods: {
    selectScenario (scenario, index) {
      scenario.active = index;
    },
    scenarioButtonClass (scenario, index) {
      return {
        'is-active': scenario.active === index,
        'is-outlined': scenario.active !== index
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
section
  padding-bottom 0

h1.title
  margin-bottom 0
  font-weight 300

.is-hidden-tablet .field
  .control .button
    border-top-left-radius 5px
    border-top-right-radius 5px
    border-bottom-left-radius 0
    border-bottom-right-radius 0
  .control:last-child .button
    border-top-left-radius 0
    border-top-right-radius 0
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px

.is-hidden-mobile .field
  .field-label
    flex-grow 3.5
    label
      line-height 36px
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
