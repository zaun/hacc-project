<template lang="pug">
  .modal(:class='{ "is-active": modal.display }')
    .modal-background(@click='hideModal')
    .modal-content
      .box#chemical-note(v-if='modal.type === "chemicalNote"')
        .title.is-size-4.has-text-primary {{ modal.content.chemical }}
          span &nbsp;Notes
        p.is-size-6 {{ modal.content.notes }}
    button.modal-close.is-large(@click='hideModal')
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'modal',
  computed: {
    ...mapGetters([ 'modal' ])
  },
  methods: {
    ...mapActions([ 'hideModal' ])
  }
};
</script>

<style lang="stylus" scoped>
#chemical-note span
  font-weight normal
</style>
