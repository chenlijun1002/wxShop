import wepy from 'wepy';
import wxutils from './WxUtils';
import http from './http'
import vnotify from '../components/vant/notify/notify';
import vdialog from '../components/vant/dialog/dialog';
import vtoast from '../components/vant/toast/toast';
import pagemixin from '../mixins/pagemixin';
import Tips from './Tips';

export default class basepage extends wepy.page {
    
    get = http.get.bind(http);
    postForm = http.postForm.bind(http);
    postJson = http.postJson.bind(http);

    vnotify=vnotify.bind(vnotify);
    vdialog=vdialog;
    vtoast=vtoast;
    data = {
    };

    config = {}

    mixins = this.minbase(); // 声明页面所引用的Mixin实例
    ///动态获取mixins配置信息
    minbase()
    {
        var tempmixins=[];
        if(this.addmixins)
        {
          
            tempmixins=this.addmixins();
            if(tempmixins==null || !Array.isArray(tempmixins))
            {
                tempmixins=[];
            }
            tempmixins.push(pagemixin);
        }
        else
        {
            tempmixins.push(pagemixin);
        }
        return tempmixins;
    }
    
    showErrorMsg(res,callback){
        Tips.loaded();
        if(!callback){
            callback={};
        }
        Tips.error(res.Msg, () => callback);
    }

    async onLoad(option) {
        let that = this;
        
        wxutils.tryRenderPage(
            function () {
                
               return that.bindApiData(option).then(res=>{
                    that.pageIsReady = true;
                    console.log("basepagepageready",that.pageIsReady);
                    wx.setNavigationBarTitle({
                        title: that.pageTitle
                      });///设置页面标题
                    that.$apply();

                }).catch(ex=>{

                    console.log("basepagepageready=",that.pageIsReady,ex);
                    that.init = true;
                    that.$apply();

                });
        });
    }

   

    ///在这里面执行数据绑定逻辑
    async bindApiData(option)
    {
         throw "未实现基类basepagebindApiData方法";
    }
}