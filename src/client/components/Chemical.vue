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
              .is-size-4.has-text-primary 9.2E+00
              .is-size-7.has-text-grey-light mg/kg
            .column.is-one-third
              .is-size-6.has-text-grey Groundwater
              .is-size-4.has-text-primary 1.5E+04
              .is-size-7.has-text-grey-light ug/L
            .column.is-one-third
              .is-size-6.has-text-grey Soil Vapor
              .is-size-4.has-text-primary 1.1E+08
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
        a.card-footer-item.is-disabled(href='#') Show notes
</template>

<script>
export default {
  name: 'chemical',
  props: [ 'chemical' ]
};
</script>

<style lang="stylus" scoped>
.title
  margin-bottom 0.5rem


a.is-disabled
  color #b5b5b5
  cursor not-allowed
</style>
