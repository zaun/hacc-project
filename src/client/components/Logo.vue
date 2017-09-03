<template lang="pug">
  img.logo(src='../assets/hero-logo.png' v-if='hero')
  img.logo(src='../assets/logo.png' v-else)
</template>

<script>
export default {
  name: 'logo',
  props: [ 'hero' ]
};
</script>

<style lang="stylus" scoped>
</style>
