<template lang="pug">
.columns
  .column.is-hidden-tablet
    .field
      label.label.has-text-centered {{ toggle.name }}
      .control
        a.button.is-primary.is-fullwidth(
          @click='selectOption(0)'
          :class='buttonClass(0)')
          span {{ toggle[0] }}
      .control
        a.button.is-primary.is-fullwidth(
          @click='selectOption(1)'
          :class='buttonClass(1)')
          span {{ toggle[1]}}
  .column.is-hidden-mobile
    .field.is-horizontal
      .field-label
        label.label {{ toggle.name }}
      .field-body
        .control
          a.button.is-primary(
            @click='selectOption(0)'
            :class='buttonClass(0)')
            span {{ toggle[0] }}
        .control
          a.button.is-primary(
            @click='selectOption(1)'
            :class='buttonClass(1)')
            span {{ toggle[1]}}
</template>

<script>
export default {
  name: 'toggle',
  props: [ 'name' ],
  computed: {
    toggle () {
      return this.$store.getters.toggle(this.name);
    }
  },
  methods: {
    selectOption (index) {
      this.$store.dispatch('selectToggleOption', {
        name: this.name,
        index
      });
    },
    buttonClass (index) {
      return {
        'is-active': this.toggle.selected === index,
        'is-outlined': this.toggle.selected !== index
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.is-hidden-tablet .field
  .control .button
    border-top-left-radius 5px
    border-top-right-radius 5px
    border-bottom-left-radius 0
    border-bottom-right-radius 0
  .control:last-child .button
    border-top-left-radius 0
    border-top-right-radius 0
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px

.is-hidden-mobile .field
  .field-label
    flex-grow 3.5
    label
      line-height 36px
  .control:first-child .button
    border-top-left-radius 20px
    border-top-right-radius 0
    border-bottom-left-radius 20px
    border-bottom-right-radius 0
  .control:last-child .button
    border-top-left-radius 0
    border-top-right-radius 20px
    border-bottom-left-radius 0
    border-bottom-right-radius 20px
</style>
