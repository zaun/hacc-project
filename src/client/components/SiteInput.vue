<template lang="pug">
  .columns
    .column.is-8.is-offset-2
      .field.is-horizontal
        .field-label
          label.label {{ label }}
        .field-body
          .field
            .control
              input.input(type='text' v-if='type === "text"')
              textarea.textarea(rows='3' v-if='type === "textarea"')
              datepicker(
                v-model='date'
                :config='config'
                v-if='type === "datepicker"')

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
  props: [ 'type', 'label' ],
  data () {
    return {
      date: moment().format('YYYY-MM-DD'),
      config: {
        altFormat: 'M j, Y',
        altInput: true,
      }
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
