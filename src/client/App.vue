<template lang="pug">
  #app
    router-view
</template>

<script>
export default {
  name: 'app'
};
</script>

<style lang="stylus">
html
body
  width 100%
  height 100%
  font-family 'Source Sans Pro', sans-serif

#app
  background-color whitesmoke

.contaminants
  .control
  .dropdown
  .dropdown-toggle
    width 100%
  .v-select .dropdown-menu > .highlight > a
    background #00d1b2

.is-hidden-mobile
  .contaminants
    .control
    .dropdown
    .dropdown-toggle
      max-width 400px

.print-only
  display none

.screen-only
  display block

@media print
  body
    -webkit-print-color-adjust exact
    color-adjust exact

  .page-break
    page-break-after always

  .print-only
    display block

  .screen-only
    display none
</style>
