<template lang="pug">
nav.navbar
  .navbar-brand
    a.navbar-item(href='/')
      logo
</template>

<script>
import Logo from '@/components/Logo.vue';

export default {
  name: 'navBar',
  components: { Logo }
};
</script>

<style lang="stylus" scoped>
</style>
