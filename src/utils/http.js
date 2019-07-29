import wepy from 'wepy';
import Tips from './Tips';

export default class http {

    
    static async get(gateway,apiPath, data, loading = true)
    {
        let apiRs=await this.apiRequest('GET', gateway,apiPath,data,"application/json", loading);
        return this.bizExect(apiRs)
    }


    static async postForm(gateway,apiPath, data,loading = true) {

        let apiRs=await this.apiRequest('POST', gateway,apiPath, data,"application/x-www-form-urlencoded", loading);
        return this.bizExect(apiRs);
    }

    static async postJson(gateway,apiPath, data,loading = true) {
        let apiRs=await this.apiRequest('POST', gateway,apiPath, data,"application/json", loading);
        return this.bizExect(apiRs);
    }


    static bizExect(apiRs)
    {
      
        if(apiRs.HttpCode==423)
        {
            apiRs.Next=false;
            console.log(apiRs,"423");///登录中，其它请求会被终止
            return apiRs;
        }

        if(apiRs.HttpCode==403)
        {
            apiRs.Next=false;
           //wx.navigateTo({url:"/pages/home/login"});///跳转到到登录页
           const pages = getCurrentPages();
           const page=pages[pages.length-1];
           const returnUrl='/' + page.__route__;
           console.log(page);
           wepy.redirectTo({url:"/pages/home/login?returnUrl="+returnUrl});
            console.log(apiRs,"403");
            return apiRs;
        }

        if(apiRs.HttpCode==404)
        {
            apiRs.Next=false;
            Tips.error(apiRs.Msg);///弹出对应的提示
            console.log(apiRs);
            return apiRs;
        }

        // var bizRs=callBack(apiRs);

        // if(bizRs)
        // {
        //     ///在这里处理通用的框架层逻辑
        //     if(apiRs.HttpCode!=200)
        //     {
        //         Tips.error(apiRs.Msg);///弹出对应的提示
        //         console.log(apiRs);
        //     }
        // }
        return apiRs
    }
   

   
  


    static async apiRequest(method, gateway,apiPath, data,contenType, loading = true) 
    {
        if(wepy.$instance.globalData.stopReq)
        {
            return {
                HttpCode:423,
                Next:true,
                Code:423,
                Msg:"正在登录中，放弃当前请求！",
                Data:null
            };
        }


        let url=this.getApiUrl(gateway,apiPath);
        return await this.wxRequest(method, url, data, contenType,loading);
    }

    
    static getApiUrl(gateway,apiPath)
    {
        let baseUrl = wepy.$instance.globalData.xkdApiDomians;
        let storeId=wepy.$instance.globalData.extConfig.storeId;

       if(baseUrl[gateway]){
           return `${baseUrl[gateway]}/${storeId}/${apiPath}`;
       }
       return baseUrl.default+apiPath;
    }

    static async wxRequest(method, url, data,contenType, loading = true) {
        const param = {
            url: url,
            method: method,
            data: data,
            header: this.GetWxaHeader(contenType)
        };
        if (loading) {
            // Tips.loading();
        }

       
        const wpRes = await wepy.request(param);
        let res = wpRes.data;
        if(res)
        {
            res.HttpCode=wpRes.statusCode;
            res.Next=true;
        }
        else
        {
            res={
                HttpCode:wpRes.statusCode,
                Code:wpRes.statusCode,
                Data:null,
                Next:true
            };
        };
        return res;
    }

    ///公共请求头
    static GetWxaHeader(contenType) {
        let headerData =
        {
            "Req-Host": wepy.$instance.globalData.extConfig.appId,
            "Content-Type":contenType,//"application/x-www-form-urlencoded"//application/json,
            "Xkd-From": "weapp",
            "Authorization": 'Bearer ' + wepy.$instance.globalData.jwtToken,
        };
        return headerData;
    }

}
