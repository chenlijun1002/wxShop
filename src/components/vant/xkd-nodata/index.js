import { VantComponent } from '../common/component';
import wepy from 'wepy';
VantComponent({
  props: {
    customStyle:String,
    pageType: String,
    size: String,
    color: String,
    customStyle: String,
    fileImageType:  String, 
    classPrefix: {
      type: String,
      value: 'van-icon'
    },
    hasButton: {
        type: Boolean,
        value: true
    },
    btnStyle: {
        type: String,
        value: "font-size: 28rpx;width: 160rpx; background: #fff; white-space:nowrap; color: #424242; text-align: center; padding-left: 0; padding-right:0"
      },
    textMsg:{
        type: String,
        value: "暂未实现功能"
   },
   btnText:{
        type: String,
        value: "返回首页"
   },
   imageStyle: {
       type: String,
       value: "width: 296rpx; height: 272rpx; margin-top: 160rpx;"
   }
  },
  data:{
    fileImage:"",
  },
  mounted: function () {
    ///渲染前的生命周期    
    if(wepy.$instance.globalData.CdnUrl){
      let fileImage= `${wepy.$instance.globalData.CdnUrl}/${this.data.fileImageType}`;
      this.setData({fileImage: fileImage});
    }else{
      setTimeout(()=>{
        let fileImage= `${wepy.$instance.globalData.CdnUrl}/${this.data.fileImageType}`;        
        this.setData({fileImage: fileImage});             
      },2000)
    }
    
  },
  methods: {
    onClick: function onClick() {
      this.$emit('redirectToPage');
    }
  }
});