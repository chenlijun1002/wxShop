import base from './baseapi'
import wepy from 'wepy';
import Tips from '../utils/Tips';
import wxutils from '../utils/WxUtils';

/**
 * 权限服务类
 */
export default class auth extends base {


    /**
  * 登录检查.如果成功，则返回等录数据
  */
    static async trylogin() {
        let that = this;
        try {

            let { code } = await wepy.login();
            let data = { code: code };
            let res = await this.postForm('vshop', 'Login/WxaConfig', data);
           
            if (!res.Next) {

                return "stop";///请求被框架阻止了，在这里结束
            }

            if (res.HttpCode == 200) {

                ///非零处理
                if (res.Code != 0) {

                    Tips.loaded();
                    switch (res.Code) {
                        case 50002://店铺未绑定小程序
                            Tips.modal(res.Msg, "小程序加载异常");
                            break;
                        case 50003:///小程序授权已取消
                            Tips.modal(res.Msg, "小程序加载异常");
                            break;
                        case 50004:///小程序授权方配置异常
                            Tips.modal(res.Msg, "小程序加载异常");
                            break;
                        case 50005:///code已经被使用
                        default:
                            ///服务不可用，请稍后重试
                            Tips.modal(res.Msg, "小程序加载异常").then(res => {
                                wepy.reLaunch({ url: '/pages/home/initfaild' })
                            });
                    }

                    return 'faild';
                }


                wepy.$instance.globalData.logincode = code;
                wepy.$instance.globalData.isInit = true;
                wepy.$instance.globalData.initFail = false;///初始化异常了，
                wepy.$instance.globalData.isLogin = res.Data.IsLogin;///当前用户已经登录

                if (res.Data.IsLogin) {
                    if (res.Data.JwtToken != "") {
                        wepy.$instance.globalData.jwtToken = res.Data.JwtToken;///用户JWT令牌
                        wepy.setStorageSync("jwtToken", res.Data.JwtToken);
                    }
                }
                else {
                    wepy.$instance.globalData.jwtToken = "";///未登录时，
                }

                wepy.$instance.globalData.fundebug.metaData = {
                    company:
                    {
                        userId:res.Data.UserId,
                        wxaOpenId:res.Data.WxaOpenId,
                        storeid:res.Data.StoreId,
                        wxaAppId:wepy.$instance.globalData.extConfig.appId,
                    }
               };
                wepy.setStorageSync("mtj_unionId",res.Data.WxaOpenId);
                let StoreInfo= res.Data.StoreInfo;
                StoreInfo.width=res.Data.LogoWidth;  
                StoreInfo.height=res.Data.LogoHeight;   
                StoreInfo.AllProductNum=res.Data.AllProductNum||0;  
                StoreInfo.LatestNum=res.Data.LatestNum||0;          
                wepy.$instance.globalData.wxaOpenId=res.Data.WxaOpenId;
                wepy.$instance.globalData.userId = res.Data.UserId;///当前用户信息
                wepy.$instance.globalData.oemInfo = res.Data.OemInfo;///OEM产商信息
                wepy.$instance.globalData.storeInfo = StoreInfo;//res.Data.StoreInfo;///当前店铺信息
                wepy.$instance.globalData.tabBarConfig = res.Data.TabBar;///当前Tabar信息
                wepy.$instance.globalData.closeCopyright = res.Data.CloseCopyright;///是否关闭当前的版权信息
                
                ///取出tabbar的后台页面路径
                if(res.Data.TabBar){
                    res.Data.TabBar.forEach(function(tabitem){
                        let tempPath= tabitem.pagePath;
                        if(tempPath.indexOf('/')==0){
                            tempPath=tempPath.substring(1);
                        }
                        wepy.$instance.globalData.tabApiPages.push(tempPath);
                    });
                }
                
                console.log('tabApiPages', wepy.$instance.globalData.tabApiPages);
                wepy.$instance.globalData.StoreExpired = res.Data.StoreExpired;///当前店铺是否过期
                wepy.$instance.globalData.IsTrialStore = res.Data.IsTrialStore;///当前店铺是否试用店铺
                wepy.$instance.globalData.CdnUrl=res.Data.CdnUrl;
               
                ///店铺风格
                wepy.$instance.globalData.navstyleconfig = {
                    PrimaryColor: res.Data.StoreColorConfig.themeColor,
                    PlainColor: res.Data.StoreColorConfig.subColor
                }
                wepy.$instance.globalData.textstyleconfig = {
                    PrimaryColor: wxutils.XkdNavTextColor(res.Data.StoreColorConfig.themeColor),
                    PlainColor: wxutils.XkdNavTextColor(res.Data.StoreColorConfig.subColor)
                }
                console.log(wxutils.XkdNavTextColor(res.Data.StoreColorConfig.subColor),667)
                return "ok";
            }
            else {
                console.log('trylogin异常', res);
                Tips.loaded();
                Tips.modal(res.Msg, "初始化异常").then(res => {
                    wepy.reLaunch({ url: '/pages/home/initfaild' })
                });
                return 'faild';
            }

        }
        catch (ex) {

            console.log("trylogin异常", ex);

            Tips.loaded();
            Tips.modal(JSON.stringify(ex), "初始化异常").then(res => {
                wepy.reLaunch({ url: '/pages/home/initfaild' })
            });
            return 'faild';
        }

    }

}