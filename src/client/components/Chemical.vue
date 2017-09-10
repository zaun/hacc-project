<template lang="pug">
  .column.is-half-desktop
    .card
      header.card-header
        p.card-header-title {{ chemical.chemical }}
          span.has-text-grey-light &nbsp;({{ chemical.cas }})
      .card-content
        .content
          .title.is-5.has-text-centered Final EALs
          .columns.has-text-centered
            .column.is-one-third
              .is-size-6.has-text-grey Soil
              .is-size-4.has-text-primary {{ chem.soil.toExponential(1) }}
              .is-size-7.has-text-grey-light mg/kg
            .column.is-one-third
              .is-size-6.has-text-grey Groundwater
              .is-size-4.has-text-primary {{ chem.groundwater.toExponential(1) }}
              .is-size-7.has-text-grey-light ug/L
            .column.is-one-third
              .is-size-6.has-text-grey Soil Vapor
              .is-size-4.has-text-primary {{ chem.vapor.toExponential(1) }}
              .is-size-7.has-text-grey-light ug/m3
          .title.is-5.has-text-centered Enter site data
          .columns.has-text-centered
            .column.is-one-third
              .field
                .control
                  input.input.is-info.has-text-centered(type='text' placeholder='Soil')
              .is-size-7.has-text-grey-light mg/kg
            .column.is-one-third
              .field
                .control
                  input.input.is-info.has-text-centered(type='text' placeholder='Groundwater')
              .is-size-7.has-text-grey-light ug/L
            .column.is-one-third
              .field
                .control
                  input.input.is-info.has-text-centered(type='text' placeholder='Soil Vapor')
              .is-size-7.has-text-grey-light ug/m3
      footer.card-footer
        a.card-footer-item.is-disabled View details
        a.card-footer-item(:class='{ "is-disabled": !chemical.notes.length }' @click='showModal') View notes
</template>

<script>

export default {
  name: 'chemical',
  props: [ 'chemical' ],
  data () {
    return {
      chem: {
        soil: 9.234,
        groundwater: 15460,
        vapor: 112385918
      }
    };
  },
  methods: {
    a () {
      var a = 9.2;
      return a.toExponential();
    },
    showModal () {
      if (this.chemical.notes.length) {
        this.$store.dispatch('showModal', {
          type: 'chemicalNote',
          content: {
            chemical: this.chemical.chemical,
            notes: this.chemical.notes
          }
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.title
  margin-bottom 0.5rem


a.is-disabled
  color #b5b5b5
  cursor not-allowed
</style>
