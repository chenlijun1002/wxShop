import Tips from './Tips';
import wepy from 'wepy';
import Color from 'color';
import richText from './richText';

function splitArr(arr1, arr2) {
  setFlag(arr1, arr2);
  var newArr = cloneObj(arr2);
  var newArr2 = cloneObj(arr2);  
  //var indexArr=[];
  arr1.forEach(function (item, index) {
    //var obj = { name: "video", children: newArr[item.parentIdx].children[item.Index] };
    var obj = { name: "video", children: item };
    var index = findArrIndex(item.parentIdx, item.Index, arr2);
    var length = arr2[index].children.length;
    arr2[index].children.splice(item.Index, length);
    var newChildren = newArr2[item.parentIdx].children.slice(item.Index + 1);
    arr2.splice(item.Index + index, 0, obj);
    //indexArr.push(index);
    if (newChildren.length > 0) {
      var len = newArr2[item.parentIdx].children.length;
      var newParentObj = cloneObj(newArr2[item.parentIdx]);
      newParentObj.children.splice(0, len);
      newParentObj.children = newChildren;     
      var insertIndex = caclIndex(arr1, arr2, newArr2);
      insertIndex.forEach(function (item, index) {
        if (item.videoId === newParentObj.videoId) {
          arr2.splice(item.index + item.count + 1, 0, newParentObj);
        }
      })
    }
  });
  return arr2;
}
function cloneObj(obj) {
  var str, newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window) {
    str = JSON.stringify(obj), //系列化对象
      newobj = JSON.parse(str); //还原
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ?
        cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
};
function filterVideo(arr) {
  var videoArr = [];
  var videoObj = {};
  arr.forEach(function (item, index) {
    item.children.forEach(function (v, i) {
      if (v.name && v.name === "video") {
        videoObj = cloneObj(v.attrs);
        videoObj.parentIdx = index;
        videoObj.Index = i;
        videoArr.push(videoObj);
      }
    })
  })
  return videoArr;
}
function caclIndex(arr1, arr2, newArr2) {
  let arr = [];
  for (var i = 0; i < arr2.length; i++) {
    if (arr2[i].videoId) {
      let count = 0, index = i, videoId = arr2[i].videoId;
      for (var j = 0; j < newArr2.length; j++) {
        if (arr2[i].videoId && newArr2[j].videoId && arr2[i].videoId === newArr2[j].videoId) {
          for (var k = 0; k < arr2.length; k++) {
            if (k > i && arr2[k].name === "video" && arr2[k].children.parentIdx == j) {
              count++;
            }
          }
        }
      }
      arr.push({ count: count, index: index, videoId: videoId });
    }
  }
  return arr;
}
function findArrIndex(parentIdx, Index, arr2) {
  var indx;
  for (var i = 0; i < arr2.length; i++) {
    if (arr2[i].videoId && arr2[i].videoId === "" + parentIdx + Index) {
      return i;
    }
  }
  return indx;
}
function setFlag(arr1, arr2) {
  arr1.forEach(function (item, index) {
    arr2[item.parentIdx].videoId = "" + item.parentIdx + item.Index;
  })
}

function filterSource(str){
  var reg = /<source.*?\/>/g;  
  str = str.replace(reg, '');
  return str;
}

export default class WxUtils {

  static async tryRenderPage(callback)
  {
    
    if(!wepy.$instance.globalData.isInit)
    {
      Tips.loading("初始化");
      while(true)
      {
        await this.sleep(200);
        if(wepy.$instance.globalData.isInit)
        {
          Tips.loaded();
          break;
        }

        if(wepy.$instance.globalData.initFail)
        {
          Tips.loaded();
          return;////初始化失败后，直接停止运行
        }
      }
    }
    
    callback().then(res=>{
      Tips.loaded();
    });
  }


  static  sleep (s) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(s);
      }, s)
    })
  }


  static wxPromisify(fn) {
    return function (obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function (res) {
          resolve(res)
        }

        obj.fail = function (res) {
          reject(res)
        }

        fn(obj)
      })
    }
  }


 
  /**
   * 如果能够后退（多层），则navigaetBack，否则调用navigateTo
   */
  static backOrNavigate(url) {
      const pages = getCurrentPages();
      // route在低版本不兼容
      const index = pages.findIndex(item => ('/' + item.__route__) == url);
      if (index < 0 ) {
        if(pages.length<9)
        {
          wepy.navigateTo({
            url: url
          });
        }
        else{
          ///超过了
          wepy.reLaunch({
            url: url
          });
        }
        
      } else {
        console.log("navigateBack"+pages.length);
        const delta = pages.length - 1 - index;
        wepy.navigateBack({
          delta: delta
        });
      }
  }

  ///注意URl是绝对路径 /page/home/index
  static redirectToPage(url) {

    const pages = getCurrentPages();
    if(url.indexOf('/')!=0)
    {
      url="/"+url;//绝对路径
    }

    const index = pages.findIndex(item => ('/' + item.__route__) == url);
    ///能够返回，就直接返回
    if(index>=0){
      const delta = pages.length - 1 - index;
      wepy.navigateBack({
        delta: delta
      });
      return
    }

    if(this.isTabPage(url))
    {
       wepy.switchTab({url:url,fail:function(){
           this.openWxaPage(url,pages.length);///尝试另外一种方式打开
       }});
       return;
    }

        ///微页面会做特殊处理，能跳tabbar的，跳tabbar
    if(url.indexOf("home/micropage?"))
    {
      let pageId=this.getQueryString("id",url);
      if(wepy.$instance.globalData.extConfig.micIds){
        let micindex = wepy.$instance.globalData.extConfig.micIds.findIndex((item)=>item==pageId);
        if(micindex>=0){
          wx.switchTab({
            url: `/pages/home/micropage${micindex+1}`
          })
        }
      }
    }
    

    this.openWxaPage(url,pages.length);///尝试另外一种方式打开

  }

  ///尝试navigateTo打开一个页面
  static openWxaPage(url,curPagesLength)
  {
    if(curPagesLength<8)
    {
      wepy.navigateTo({
        url: url
      });
    }
    else{
      ///超过了
      wepy.reLaunch({
        url: url
      });
    }
  }

  static isTabPage(url){
     let pages=wepy.$instance.globalData.extConfig.tabList;
     if(pages==null)
     {
        pages=wepy.$instance.globalData.tabApiPages;
     }

     if(pages==null){
      pages=[];///修正没数据的情况
     }

    url=url.substring(1);

    let rs=pages.indexOf(url)>=0;
    return rs;
  }

  ///从url中获取参数值
  static getQueryString(name,url) 
  { 
    var arr=url.split("?");
    if(arr.length==1){
      return null;
    }
    var reg = new RegExp("(^|&)" + name + "=([0-9]*)(&|$)");
    var r = arr[1].match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
  }

  static wxPay(param) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...param,
        complete: res => {
          if (res.errMsg == 'requestPayment:ok') {
            resolve(res);
          } else {
            reject(res);
          }
        }
      });
    });
  }

  /**
   * 兼容性判断
   */
  static canIUse(str) {
    if (wx.canIUse) {
      return wx.canIUse(str);
    } else {
      return false;
    }
  }
  /**
   * 检查SDK版本
   */
  static isSDKExipred() {
    const { SDKVersion } = wx.getSystemInfoSync();
    return SDKVersion == null || SDKVersion < '2.0.0'
  }
  

  static XkdNavTextColor(param){     
    let hex=param||wepy.$instance.globalData.navstyleconfig.PrimaryColor;      
    if (!hex) {
      return '#ffffff';
    }
    let rgb = Color(hex);
   // let lightness = Color(hex).lightness();
   let lightness = Math.sqrt(0.299*Math.pow(rgb.color[0],2) + 0.587*Math.pow(rgb.color[1],2) + 0.114*Math.pow(rgb.color[2],2))*100/255;
    let hsl = Color(hex).hsl();
    if (lightness > 65) {
      if (
        rgb.color[0] == rgb.color[1] &&
        rgb.color[0] == rgb.color[2] &&
        rgb.color[1] == rgb.color[2]
      ) {        
        return Color([rgb.color[0] - 128, rgb.color[1] - 128, rgb.color[2] - 128]).hex();
      } else if (
        rgb.color[0] != rgb.color[1] &&
        rgb.color[0] != rgb.color[2] &&
        rgb.color[1] != rgb.color[2]
      ) {        
        return Color(`hsl(${hsl.color[0]}, ${hsl.color[1] + 45}%, ${hsl.color[2] - 50}%)`).hex();
      } else {
        return '#ffffff';
      }
    } else {
      return '#ffffff';
    }
   ///顶部导航字颜色
  }

  static isShow(arr){
    if(arr.length){
      for(let i=0;i<arr.length;i++){
        if(arr[i].linkTitle){
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 微页面数据渲染
   */
  static renderData(list,$parent){   
    let pagedataList= list|| [];
    let windowWidth=0;
    let windowHeight=0; 
    let pixelRatio=2;  
    wx.getSystemInfo({
      success(res) {                  
        pixelRatio=res.pixelRatio;    
        windowWidth=res.windowWidth;
        windowHeight=res.windowHeight;
      }
    })
    console.log(pagedataList,$parent)
    pagedataList.forEach((item,index)=>{                        
        item.windowWidth=windowWidth;
        item.windowHeight=windowHeight;
        item.imgInfo=item.imgInfo||[];
        item.imgScanInfo=item.imgScanInfo||[]; 
        item.pixelRatio=  pixelRatio;         
        if(item.type==="rich_text"){
          var article = richText.go(filterSource(item.content));
          var a = filterVideo(article);
          var b = splitArr(a, article); 
            item.nodes=b;
          item.content=richText.go(item.content);       
        } 
        if(item.type==="image-hot"){
          item.images.forEach((v,i)=>{                         
              if(pixelRatio <= 2){
                v.imageUrl=`${v.imageUrl}?x-oss-process=style/720`;
              }else{
                v.imageUrl=`${v.imageUrl}?x-oss-process=style/1080`;
              }
              let L=v.width/v.height;                     
              item.imgInfo[i]={};
              item.imgInfo[i].width=v.width;
              item.imgInfo[i].height=v.height;                      
              item.imgScanInfo[i]={};
              item.imgScanInfo[i].width=windowWidth;
              item.imgScanInfo[i].height=windowWidth/L;
              v.scanWidth=windowWidth;
              v.scanHeight=windowWidth/L;
              v.pixelRatio=pixelRatio; 
              v.hotData=v.hotData||[];
              v.hotData.forEach((val)=>{                       
                val.scanWidth=windowWidth*(val.width/592);
                val.scanHeight=(windowWidth*(val.width/592))/(val.width/val.height);
                val.scanY=val.y*(windowWidth/L)/(592/L);
                val.scanX=val.x*windowWidth/592;
              })                       
            })      
        }
        if(item.type==='storebanner'){
          item.storeName=$parent.globalData.storeInfo.StoreName; 
          item.AllProductNum=$parent.globalData.storeInfo.AllProductNum; 
          item.LatestNum=$parent.globalData.storeInfo.LatestNum; 
          item.shareimg=item.shareimg||pixelRatio<=2?'http://insidexkd.oss-cn-shanghai.aliyuncs.com/xkdnewyun/Template/t1/images/storeBackground.png?x-oss-process=style/720':'http://insidexkd.oss-cn-shanghai.aliyuncs.com/xkdnewyun/Template/t1/images/storeBackground.png?x-oss-process=style/1080';                                           
          item.width=$parent.globalData.storeInfo.width||0;
          item.height=$parent.globalData.storeInfo.height||0;  
           if(pixelRatio <= 2){          
            item.storeLogo=item.width?`${$parent.globalData.CdnUrl}/${$parent.globalData.storeInfo.StoreLogo}?x-oss-process=style/180`:'http://insidexkd.oss-cn-shanghai.aliyuncs.com/xkdnewyun/systemfile/store/storelogo.png?x-oss-process=style/180'; 
          }else{           
            item.storeLogo=item.width?`${$parent.globalData.CdnUrl}/${$parent.globalData.storeInfo.StoreLogo}?x-oss-process=style/240`:'http://insidexkd.oss-cn-shanghai.aliyuncs.com/xkdnewyun/systemfile/store/storelogo.png?x-oss-process=style/240'; 
          }                 
          item.imgScanInfo[0]={};
          if(item.layout==4||item.layout==3){
            item.imgScanInfo[0].width=70;
            item.imgScanInfo[0].height=item.width?(70/(item.width/item.height)):70;
          }else{
            item.imgScanInfo[0].width=58;
            item.imgScanInfo[0].height=item.width?(58/(item.width/item.height)):58;
          }
        }
        if(item.type==='image-nav'||item.type==='image-ad'){
            item.showLinkTitle=this.isShow(item.images);
            item.images.forEach((v,i)=>{                         
              item.imgInfo[i]={};
              item.imgInfo[i].width=v.width;
              item.imgInfo[i].height=v.height;                      
              item.imgScanInfo[i]={};
              item.imgScanInfo[i].width=v.width;
              item.imgScanInfo[i].height=v.height; 
              if(item.layout==1||item.layout==2){
                if(item.type==='image-ad'){
                  if(pixelRatio <= 2){
                    v.imageUrl=`${v.imageUrl}?x-oss-process=style/720`;
                  }else{
                    v.imageUrl=`${v.imageUrl}?x-oss-process=style/1080`;
                  }
                }else{
                  if(item.images.length<=2){                   
                    if(pixelRatio <= 2){
                      v.imageUrl=`${v.imageUrl}?x-oss-process=style/720`;
                    }else{
                      v.imageUrl=`${v.imageUrl}?x-oss-process=style/1080`;
                    } 
                  }else{
                    if(pixelRatio <= 2){
                      v.imageUrl=`${v.imageUrl}?x-oss-process=style/540`;
                    }else{
                      v.imageUrl=`${v.imageUrl}?x-oss-process=style/720`;
                    }
                  }
                }
              }else if(item.layout==3){ 
                if(pixelRatio <= 2){
                  v.imageUrl=`${v.imageUrl}?x-oss-process=style/360`;
                }else{
                  v.imageUrl=`${v.imageUrl}?x-oss-process=style/540`;
                }
                if(i==0){
                  let scanHeight=336/(v.width/v.height);
                  let scanWidth=scanHeight*(v.width/v.height);
                  item.imgScanInfo[i].width=scanWidth;
                  item.imgScanInfo[i].height=scanHeight; 
                }else{
                  let scanWidth=item.imgScanInfo[0].height*(v.width/v.height);
                  item.imgScanInfo[i].width=scanWidth;
                  item.imgScanInfo[i].height=item.imgScanInfo[0].height; 
                }
                                                                    
              }else if(item.layout==4){  
                if(pixelRatio <= 2){
                  v.imageUrl=`${v.imageUrl}?x-oss-process=style/240`;
                }else{
                  v.imageUrl=`${v.imageUrl}?x-oss-process=style/360`;
                }                      
                if(i==0){
                  let scanHeight=150/(v.width/v.height);
                  let scanWidth=scanHeight*(v.width/v.height);
                  item.imgScanInfo[i].width=scanWidth;
                  item.imgScanInfo[i].height=scanHeight; 
                }else{                          
                  let scanWidth=item.imgScanInfo[0].height*(v.width/v.height);
                  item.imgScanInfo[i].width=scanWidth;
                  item.imgScanInfo[i].height=item.imgScanInfo[0].height; 
                }
              }else if(item.layout==5){  
                if(item.images.length<=2){                   
                  if(pixelRatio <= 2){
                    v.imageUrl=`${v.imageUrl}?x-oss-process=style/720`;
                  }else{
                    v.imageUrl=`${v.imageUrl}?x-oss-process=style/1080`;
                  } 
                }else{
                  if(pixelRatio <= 2){
                    v.imageUrl=`${v.imageUrl}?x-oss-process=style/540`;
                  }else{
                    v.imageUrl=`${v.imageUrl}?x-oss-process=style/720`;
                  }
                }                         
                if(i==0){
                  let scanHeight=71/(v.width/v.height);
                  let scanWidth=scanHeight*(v.width/v.height);
                  item.imgScanInfo[i].width=scanWidth;
                  item.imgScanInfo[i].height=scanHeight; 
                }else{                          
                  let scanWidth=item.imgScanInfo[0].height*(v.width/v.height);
                  item.imgScanInfo[i].width=scanWidth;
                  item.imgScanInfo[i].height=item.imgScanInfo[0].height; 
                }
              }
            })                    
        } 
    })
    return pagedataList;
  }

  /**
   * 时间戳转换日期时间格式
   */
  static date(unixtime){ 
     var dateTime = new Date(parseInt(unixtime) * 1000)
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      var minute = dateTime.getMinutes();
      var second = dateTime.getSeconds();
      var now = new Date();
      var now_new = Date.parse(now.toDateString());  //typescript转换写法
      var milliseconds = now_new - dateTime;
      var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      return timeSpanStr;
  }

  static ChangeCopyRight(data){
    var pages = getCurrentPages();
    var com=pages[pages.length - 1].selectComponent("#wxacopyright");
    if(com){
      com.showCopyright(data);///在页面初始化过程，得不到这个数据
    }
  }

  /**
   * 商品详情富文本
   */
  static splitArr(arr1, arr2) {    
    setFlag(arr1, arr2);
    var newArr = cloneObj(arr2);
    var newArr2 = cloneObj(arr2);  
    //var indexArr=[];
    arr1.forEach(function (item, index) {
      //var obj = { name: "video", children: newArr[item.parentIdx].children[item.Index] };
      var obj = { name: "video", children: item };
      var index = findArrIndex(item.parentIdx, item.Index, arr2);
      var length = arr2[index].children.length;
      arr2[index].children.splice(item.Index, length);
      var newChildren = newArr2[item.parentIdx].children.slice(item.Index + 1);
      arr2.splice(item.Index + index, 0, obj);
      //indexArr.push(index);
      if (newChildren.length > 0) {
        var len = newArr2[item.parentIdx].children.length;
        var newParentObj = cloneObj(newArr2[item.parentIdx]);
        newParentObj.children.splice(0, len);
        newParentObj.children = newChildren;     
        var insertIndex = caclIndex(arr1, arr2, newArr2);
        insertIndex.forEach(function (item, index) {
          if (item.videoId === newParentObj.videoId) {
            arr2.splice(item.index + item.count + 1, 0, newParentObj);
          }
        })
      }
    });
    return arr2;
  }
  static cloneObj(obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
      return;
    } else if (window) {
      str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
      for (var i in obj) {
        newobj[i] = typeof obj[i] === 'object' ?
          cloneObj(obj[i]) : obj[i];
      }
    }
    return newobj;
  };
  static filterVideo(arr) {
    var videoArr = [];
    var videoObj = {};
    arr.forEach(function (item, index) {
      item.children.forEach(function (v, i) {
        if (v.name && v.name === "video") {
          console.log(this)
          videoObj = cloneObj(v.attrs);
          videoObj.parentIdx = index;
          videoObj.Index = i;
          videoArr.push(videoObj);
        }
      })
    })
    return videoArr;
  }
  static caclIndex(arr1, arr2, newArr2) {
    let arr = [];
    for (var i = 0; i < arr2.length; i++) {
      if (arr2[i].videoId) {
        let count = 0, index = i, videoId = arr2[i].videoId;
        for (var j = 0; j < newArr2.length; j++) {
          if (arr2[i].videoId && newArr2[j].videoId && arr2[i].videoId === newArr2[j].videoId) {
            for (var k = 0; k < arr2.length; k++) {
              if (k > i && arr2[k].name === "video" && arr2[k].children.parentIdx == j) {
                count++;
              }
            }
          }
        }
        arr.push({ count: count, index: index, videoId: videoId });
      }
    }
    return arr;
  }
  static findArrIndex(parentIdx, Index, arr2) {
    var indx;
    for (var i = 0; i < arr2.length; i++) {
      if (arr2[i].videoId && arr2[i].videoId === "" + parentIdx + Index) {
        return i;
      }
    }
    return indx;
  }
  static setFlag(arr1, arr2) {
    arr1.forEach(function (item, index) {
      arr2[item.parentIdx].videoId = "" + item.parentIdx + item.Index;
    })
  }
  
  static filterSource(str){
    var reg = /<source.*?\/>/g;  
    str = str.replace(reg, '');
    return str;
  }
}
