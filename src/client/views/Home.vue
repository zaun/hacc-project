<template lang="pug">
  .home
    h1 Hiya
    hello

</template>

<script>
import Hello from '../components/Hello.vue';

export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  components: { Hello }
};
</script>

<style lang="stylus" scoped>
h1, h2
  font-weight normal

ul
  list-style-type none
  padding 0

li
  display inline-block
  margin 0 10px

a
  color #00b983
</style>
