<template lang="pug">
  .columns
    .column.is-hidden-tablet
      .field
        .field-label
          label.label Select contaminant(s)
        .field-body.contaminants
          .control
            v-select(
              multiple
              placeholder='Select contaminant(s)'
              :label='listChemicalsBy'
              :options='chemicalList'
              :on-change='update')
    .column.is-hidden-mobile
      .field.is-horizontal
        .field-label
          label.label Select contaminant(s)
        .field-body.contaminants
          .control
            v-select(
              multiple
              placeholder='Select contaminant(s)'
              :label='listChemicalsBy'
              :options='chemicalList'
              :on-change='update')
</template>

<script>
import VSelect from 'vue-select';
import { mapGetters } from 'vuex';

export default {
  name: 'selectContaminants',
  components: { VSelect },
  computed: {
    ...mapGetters([ 'chemicalList' ]),
    listChemicalsBy () {
      var selected = this.$store.getters.toggle('Select contaminant by').selected;
      return selected === 0 ? 'chemical' : 'cas';
    }
  },
  methods: {
    update (val) {
      this.$store.dispatch('updateSelectedChemicals', val);
    }
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
