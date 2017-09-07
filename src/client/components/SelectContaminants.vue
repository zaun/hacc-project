<template lang="pug">
  section.section
    .container
      h1.title.is-2.has-text-grey.has-text-centered Select Contaminant(s)
      .box.is-hidden-tablet
        .columns
          .column
            .field
              label.label.has-text-centered {{ options.label }}
              .control
                a.button.is-primary.is-fullwidth(
                  @click='selectOption(options, 0)'
                  :class='optionButtonClass(options, 0)')
                  span {{ options[0].name }}
              .control
                a.button.is-primary.is-fullwidth(
                  @click='selectOption(options, 1)'
                  :class='optionButtonClass(options, 1)')
                  span {{ options[1].name }}
        .columns
          .column
            .field
              .field-label
                label.label Select contaminant(s)
              .field-body.contaminants
                .control
                  v-select(multiple :options='contaminantOptions')
      .box.is-hidden-mobile
        .columns
          .column
            .field.is-horizontal
              .field-label
                label.label {{ options.label }}
              .field-body
                .control
                  a.button.is-primary(
                    @click='selectOption(options, 0)'
                    :class='optionButtonClass(options, 0)')
                    span {{ options[0].name }}
                .control
                  a.button.is-primary(
                    @click='selectOption(options, 1)'
                    :class='optionButtonClass(options, 1)')
                    span {{ options[1].name }}
        .columns
          .column
            .field.is-horizontal
              .field-label
                label.label Select contaminant(s)
              .field-body.contaminants
                .control
                  v-select(multiple :options='contaminantOptions')
  </div>
</template>

<script>
import VSelect from 'vue-select'

export default {
  name: 'selectContaminants',
  components: { VSelect },
  props: [ 'options' ],
  data () {
    return {
      contaminantOptions: [
        'Acenaphthene',
        'Acenaphthylene',
        'Acetone',
        'Aldrin',
        'Ametryn',
        'Amino,2- Dinitrotoluene,4,6-',
        'Amino,4- Dinitrotoluene,2,6-'
      ]
    }
  },
  methods: {
    selectOption (option, index) {
      option.active = index;
    },
    optionButtonClass (option, index) {
      return {
        'is-active': option.active === index,
        'is-outlined': option.active !== index
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
h1.title
  margin-bottom 0
  font-weight 300

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
