import { VantComponent } from '../common/component';
VantComponent({
  classes: ['title-class'],
  props: {
    title: String,
    leftText: String,
    rightText: String,
    leftArrow: String,
    fixed: Boolean,
    textcolor:String,
    bgcolor:String,
    zIndex: {
      type: Number,
      value: 1
    }
  },
  methods: {
    onClickLeft: function onClickLeft() {
      this.$emit('click-left');
    },
    onClickRight: function onClickRight() {
      this.$emit('click-right');
    }
  }
});