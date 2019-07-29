import { VantComponent } from '../common/component';
import wepy from 'wepy';
import addressApi from '../../../api/address';
import Toast from '../toast/toast';
import wxutils from '../../../utils/WxUtils';
VantComponent({
  props: {},
  data:{
    fileImage:"",
  },
  mounted: function () {
    ///渲染前的生命周期    
    if(wepy.$instance.globalData.CdnUrl){
      let fileImage= `${wepy.$instance.globalData.CdnUrl}/xkdnewyun/systemfile/wxashop/icon/wechat.png`;
      this.setData({fileImage: fileImage});
    }else{
      setTimeout(()=>{
        let fileImage= `${wepy.$instance.globalData.CdnUrl}/xkdnewyun/systemfile/wxashop/icon/wechat.png`;        
        this.setData({fileImage: fileImage});             
      },2000)
    }
    Toast.setDefaultOptions({selector: '#wvan-toast',context:this});
  },
  methods: {
    onClickWechat: function onClickWechat() {  
     let that=this;
    wx.chooseAddress({
        success(res) {
            that.$emit('wechataddress', res);  
            addressApi.AddWeixinAddress({
                userName: res.userName,
                phone: res.telNumber==='020-81167888'?'13112345678':res.telNumber,
                provName: res.provinceName,
                cityName: res.cityName,
                districtName: res.countyName,
                detail: res.detailInfo
            }).then(resData=>{
             if(resData.Code ===0) {
                that.$emit('wechataddress', {...res,id:resData.Data});
             }
             else{
                Toast(resData.Msg);
             }
            });
        }
    })
    },
    onClickAdd: function onClickAdd() {
        let link ="/pages/member/addAddress"; 
        wxutils.redirectToPage(link);
    },
  }
});