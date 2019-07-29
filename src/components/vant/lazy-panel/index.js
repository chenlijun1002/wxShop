import { VantComponent } from '../common/component';

VantComponent({
  props: {
    customStyle: String,///自定义智行内样式
    notifynum: {
      type: Number,///默认只动触发一次，0表示不限制
      value: 1
    },
    randomId: {
      type: String,
      value: ""
    },
  },
  data: {
    show_observer: true,
    hasnotifynum: 0
  },
  beforeCreate: function () {
    ///渲染前的生命周期

  },
  mounted: function () { ///对应原生小程序组件的ready生命周期
    let obsId = this.generateUUID();
    this.setData({ randomId: obsId });///生成一个唯一的元素ID
    this.observer = this.createIntersectionObserver().relativeToViewport({bottom:5});///创建一个
    this.observer.observe('.Lazycomponent-observer', (res) => {

      this.setData({ hasnotifynum: (this.data.hasnotifynum + 1) });///移除观察点
      
      if (this.data.notifynum > 0) {
        if (this.data.notifynum <= this.data.hasnotifynum) {
          this.setData({ show_observer: false });///移除观察点
          this.observer.disconnect()
          this.observer = null;
        }
      }

      let btm=res.intersectionRect.bottom;
      ///触发通知事件
      if(btm>0){
        this.$emit('entervisual',this.data.hasnotifynum);
      }
      else{
        this.$emit('outvisual',this.data.hasnotifynum);
      }

    });

  },
  destroyed: function () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null;
    }
  },
  methods: {
    onClick:function(e){
      this.$emit('click',event.detail);///触发
    },
    generateUUID: function () {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;///生成guid
    },
  }
});