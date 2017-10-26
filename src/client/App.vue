<template lang="pug">
  #app
    .button#feedback
      i.fa.fa-bullhorn
      |&nbsp;We value your feedback
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
  background-color #ffffff

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

#feedback
  position fixed
  top 0
  right 1.5rem
  border-top-left-radius 0
  border-top-right-radius 0
  border-top 0
  opacity 0.75
  z-index 1
  &:hover
    opacity 1

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

@page
  size auto
  margin 0mm
</style>
