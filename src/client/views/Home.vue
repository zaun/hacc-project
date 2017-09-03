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
</template>

<script>
import Logo from '@/components/Logo.vue';

export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  components: { Logo }
};
</script>

<style lang="stylus" scoped>
#home .logo
  width 100%
  max-width 400px
</style>
