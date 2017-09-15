<template lang="pug">
  .box
    span.is-size-4.has-text-weight-light Chemical of concern:
      span.has-text-weight-semibold &nbsp;{{ chemical.chemical }}
    pre
      |{{ chemical }}
      |{{ chemicalEals(chemical.chemical) }}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'chemicalReport',
  props: [ 'chemical' ],
  computed: {
    ...mapGetters([ 'chemicalEals' ])
  }
};
</script>

<style lang="stylus" scoped>
</style>
