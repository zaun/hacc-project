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
</style>
