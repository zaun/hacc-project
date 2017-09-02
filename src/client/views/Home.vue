<template lang="pug">
  .container#home
    .columns
      .column
        h1 Hiya
    hello
</template>

<script>
import Hello from '@/components/Hello.vue';

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
</style>
