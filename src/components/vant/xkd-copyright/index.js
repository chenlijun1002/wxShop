import { VantComponent } from '../common/component';
import wepy from 'wepy';
///底部版权模块
VantComponent({
  props: {
    btmargin:{type:String,value:'34rpx'},
    watchNode:{
      type:String,
      value:'#xkdmaster'
    }
  },
  data:{
    isclose:true,
    visibility:"hidden",//visible
    oemname:"",
    oemLogo:"",
    position:"relative"//absolute/relative
  },
  mounted:function(){
      ///在这里会尝试处理两次，如果两次没有成功，不设置版权信息
      if(wepy.$instance.globalData.oemInfo)
      {
         this.setInitData();///初始化数据
      }
      else{
        ///2秒后再执行
        let onumber=setTimeout(()=>{

          if(wepy.$instance.globalData.oemInfo){
            this.setInitData();///初始化数据
            clearTimeout(onumber);
          }
          else
          {
            let twNumber=setTimeout(()=>{
              this.setInitData();///初始化数据
              clearTimeout(twNumber);
            },5000);
          }
        },3000)
      }
  },
  methods: {
    setInitData:function(){
      let isclose=  wepy.$instance.globalData.closeCopyright;
      if(!isclose){
        let oemLogo=  wepy.$instance.globalData.oemInfo.Logo;
        this.setData({oemLogo:oemLogo });
        let oemname=  `${wepy.$instance.globalData.oemInfo.Name}`;
        this.setData({oemname:oemname });
        this.setData({isclose:isclose });
        this.resetPosition(1500);
      }
    },
    resetPosition:function(timeOut){
      
      let tnumber=setTimeout(() => {
        const query = wx.createSelectorQuery();
            query.select(this.data.watchNode).fields({size:true},(res) => {
            
            const sysRes = wx.getSystemInfoSync();

            if((res.height)>=sysRes.windowHeight)
            {
                 if(this.data.position=="absolute")
                 {
                   this.setData({position:"relative"});
                 }
            }
            else{
                if(this.data.position=="relative")
                 {
                   this.setData({position:"absolute"});
                 }
            }

              this.setData({visibility:"visible"});
              clearTimeout(tnumber);
            }).exec();
        }, timeOut);
        
    },
    showCopyright:function (){
      ////重置版权位置
      if(this.data.isclose){
        return;///不做处理
      }
      
      this.resetPosition(300);
      
    },
    onClick:function onClick() {
      this.$emit('redirectToPage');
    }
  }
});