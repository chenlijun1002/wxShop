import { VantComponent } from '../common/component';
VantComponent({
  props: {
    info: null,
    name: String,
    wsize:String,
    hsize:String,
    size: String,
    color: String,
    customStyle: String,
    classPrefix: {
      type: String,
      value: 'van-icon'
    }
  },
  methods: {
    onClick: function onClick() {
      this.$emit('click');
    }
  }
});