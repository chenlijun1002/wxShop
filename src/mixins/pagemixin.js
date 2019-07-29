import wepy from 'wepy';
import wxutils from '../utils/WxUtils';
export default class pagemixin extends wepy.mixin {

  data = {
    pageIsReady: false, ///页面是否初始化成功
  }

  ///这个方法在基类的onLoad方法之前，
  async onLoad(option) {

    
  }

  ///全局的计算值
  computed = {
    gobacktext() {
      if (this.navleftArrow) {
        return "";///不显示返回文字
      }
      return null;
    },

     ///主题色
     xkdcpt_PrimaryColor() {
      return this.$parent.globalData.navstyleconfig.PrimaryColor;
    },
     ///辅助色
    xkdcpt_PlainColor() {
      return this.$parent.globalData.navstyleconfig.PlainColor;
    },
    fileCdnUrl(){
      return this.$parent.globalData.CdnUrl;
    },
    XkdNavTextColor(){     
      return wxutils.XkdNavTextColor();
     ///顶部导航字颜色
    },
    ///页面模板数据
    currentData(){
     return {
      pageTitle:this.pageTitle,///页面标题
      gobacktext:this.gobacktext,///返回文字
      navleftArrow:this.navleftArrow,///是否显示返回
      activeNavIndex:this.$parent.globalData.activeNavIndex,///当前选中的tab,0开始
      xkdcpt_nav_bgcolor:this.$parent.globalData.navstyleconfig.PrimaryColor,///导航背景色
      xkdcpt_nav_titlecolor:this.XkdNavTextColor,///导航字体颜色
      shopCartNumber:this.$parent.globalData.shopCartNumber
    }
   }
  }

  methods =
    {
      tapLinkTopage(e){
        let link =e.currentTarget.dataset.link; 
        wxutils.redirectToPage(link);
      },
      linkToIndexpage(){
        let link ="/pages/home/index"; 
        wxutils.redirectToPage(link);
      }
    }
}
