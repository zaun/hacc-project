<template lang="pug">
  .columns
    .column.is-hidden-tablet
      .field
        .field-label
          label.label Select contaminant(s)
        .field-body.contaminants
          .control
            v-select(multiple :options='chemicals')
    .column.is-hidden-mobile
      .field.is-horizontal
        .field-label
          label.label Select contaminant(s)
        .field-body.contaminants
          .control
            v-select(multiple :options='chemicals')
  </div>
</template>

<script>
import VSelect from 'vue-select';

export default {
  name: 'selectContaminants',
  components: { VSelect },
  props: [ 'options' ],
  data () {
    return {
      chemicals: [
        'Acenaphthene',
        'Acenaphthylene',
        'Acetone',
        'Aldrin',
        'Ametryn',
        'Amino,2- Dinitrotoluene,4,6-',
        'Amino,4- Dinitrotoluene,2,6-'
      ]
    };
  }
};
</script>

<style lang="stylus" scoped>
.is-hidden-mobile .field
  .field-label
    flex-grow 3.5
    label
      line-height 36px
</style>
