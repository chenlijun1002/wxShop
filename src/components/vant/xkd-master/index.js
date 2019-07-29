import { VantComponent } from '../common/component';
VantComponent({
  classes: ['title-class'],
  props: {
    pagedata:Object,
    pageReady:Boolean
  },
  methods: {
    selectpagecontainer:function selectpagecontainer(){
      var selector="#page_container";
      let query=wx.createSelectorQuery().select(selector);
      console.log(query);
      return "";///返回模板内的dialog对象
    },
    selectDialog:function selectDialog(){
      var selector="#van-dialog";
      var dialog = this.selectComponent(selector);
      return dialog;///返回模板内的dialog对象
    },
    selectToast:function selectToast(){
      var selector="#van-toast";
      var toast = this.selectComponent(selector);
      return toast;///返回模板内的toast对象
    },
    selectNotify:function selectNotify(){
      var selector="#van-notify";
      var notify = this.selectComponent(selector);
      return notify;///notify
    },
    onClickLeft: function onClickLeft() {
      this.$emit('navbackclick');
    },
    onTabChange:function onTabChange(event){
      this.$emit('tab-change',event.detail);
    }
  }
});