<template lang="pug">
  .columns
    .column.is-hidden-tablet
      .field
        .field-label
          label.label Select contaminant(s)
        .field-body.contaminants
          .control
            v-select(multiple :label='listChemicalsBy' placeholder='Select contaminant(s)' :options='options' :on-change='update')
    .column.is-hidden-mobile
      .field.is-horizontal
        .field-label
          label.label Select contaminant(s)
        .field-body.contaminants
          .control
            v-select(multiple :label='listChemicalsBy' placeholder='Select contaminant(s)' :options='options' :on-change='update')
  </div>
</template>

<script>
import VSelect from 'vue-select';

export default {
  name: 'selectContaminants',
  components: { VSelect },
  computed: {
    options () {
      return this.$store.getters.chemicalList;
    },
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
