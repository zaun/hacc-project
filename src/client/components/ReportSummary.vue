<template lang="pug">
div
  .page-break(v-if='getExceededChemicals().length > 0')
  section.section#report-summary
    .container
      .title.is-2.has-text-grey Summary of
        span.has-text-danger &nbsp;Exceeded
        span &nbsp;EALs
      .box
        .category(v-for='category in getExceededChemicals()')
          .is-size-5.has-text-weight-semibold {{ category.category }}
          .hazard(v-for='hazard in category.hazards')
            .is-size-6 {{ hazard.hazard }}
            .chemicals
              table.table.is-striped.is-narrow.is-fullwidth
                tbody
                  tr
                    th Chemicals
                    th Tier 1 Action Level
                    th Inputted value
                  tr(v-for='chemical in hazard.chemicals')
                    td {{ chemical.chemical }}
                    td {{ chemical.eal }}
                      span.is-size-7.has-text-grey &nbsp;{{ chemical.unit }}
                    td {{ chemical.site }}
                      span.is-size-7.has-text-grey &nbsp;{{ chemical.unit }}
        .subtitle.is-4.has-text-grey-light.has-text-centered(v-if='!getExceededChemicals().length') No EALs Exceeded
</template>

<script>
import _ from 'lodash';

export default {
  name: 'reportSummary',
  methods: {
    getExceededChemicals () {
      var allHazards = [];
      var selectedChemicals = this.$store.getters.selectedChemicals;
      _.each(selectedChemicals, selectedChemical => {
        var hazards = [];
        _.each(this.$store.getters.chemicalEals(selectedChemical.chemical).eals, function (category) {
          var categoryHazards = _.chain(category.hazards)
            .reject(function (hazard) {
              return !_.isNumber(hazard.eal) || hazard.goal;
            })
            .map(function (hazard) {
              return {
                chemical: selectedChemical.chemical,
                unit: category.unit,
                label: category.label,
                hazard: hazard.hazard,
                eal: hazard.eal,
                site: category.site
              };
            })
            .filter(function (hazard) {
              return hazard.site > hazard.eal;
            })
            .value();
          hazards = _.concat(hazards, categoryHazards);
        });
        allHazards = _.concat(allHazards, hazards);
      });
      return _.chain(allHazards)
        .groupBy('label')
        .map(function (group, key) {
          return {
            category: key,
            hazards: _.chain(group)
              .groupBy('hazard')
              .map(function (chemicals, key) {
                return {
                  hazard: key,
                  chemicals
                };
              })
              .value()
          };
        })
        .value();
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

.subtitle
  margin-top 3rem
  margin-bottom 3rem

.category
  margin-top 1rem
  &:first-child
    margin-top 0

.hazard
  margin-top 0.5rem

.hazard
.chemicals
  padding 0 1rem

table
  margin-bottom 0
  th
  td
    font-size 0.75rem
</style>
