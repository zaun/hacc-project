<template lang="pug">
.columns
  .column.is-8.is-offset-2
    .field.is-horizontal
      .field-label
        label.label {{ label }}
      .field-body
        .field
          .control
            input.input(
              type='text'
              v-if='type === "text"'
              :value='value'
              @input='updateValue($event.target.value)')
            textarea.textarea(
              rows='3'
              v-if='type === "textarea"'
              :value='value'
              @input='updateValue($event.target.value)')
            datepicker(
              :config='config'
              v-if='type === "datepicker"'
              v-model='searchDate')
</template>

<script>
import Datepicker from 'vue-flatpickr-component';
import moment from 'moment';
import 'flatpickr/dist/flatpickr.css';

export default {
  name: 'siteInput',
  components: {
    Datepicker
  },
  props: [ 'type', 'label', 'value' ],
  data () {
    return {
      config: {
        altFormat: 'M j, Y',
        altInput: true
      }
    };
  },
  computed: {
    searchDate: {
      get () {
        var storeDate = this.$store.getters.reportInfo('searchDate');
        if (!storeDate) {
          this.$store.dispatch('updateReportInfo', {
            prop: 'searchDate',
            value: moment().format('YYYY-MM-DD')
          });
        }
        return this.$store.getters.reportInfo('searchDate');
      },
      set (value) { this.$store.dispatch('updateReportInfo', { prop: 'searchDate', value }); }
    }
  },
  methods: {
    updateValue (val) {
      this.$emit('input', val);
    }
  }
};
</script>

<style lang="stylus" scoped>
.field
  .field-label
    flex-grow 3.5
    label
      line-height 36px
</style>
