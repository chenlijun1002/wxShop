import base from './baseapi'
import wepy from 'wepy';
import Tips from '../utils/Tips';


/**
 * 购物车API接口数据
 */
export default class shopcartapi extends base {


    ///获取购物车信息
    static async GetShopCartInfo(params) {
        //let data={index:"index",rand:`${Math.random()}`};
        let res = await this.get('vshop', 'ShopCart/GetShopCartInfo', params);
        return res;
    }
    ///获取店铺全部商品的数量
    static async GetProductCountInfo(params) {
        //let data={index:"index",rand:`${Math.random()}`};
        let res = await this.get('vshop', 'Product/GetProductCountInfo', params);
        return res;
    }    
    //加入购物车
    static async SaveToShopCart(params) {
        let res = await this.postForm('vshop', 'ShopCart/SaveToShopCart',params );
        return res;
    }

    //获取购物车数量
    static async GetShopCartNumber(params) {
        let res = await this.get('vshop', 'ShopCart/GetShopCartNumber',params );
        return res;
    }
    
    //库存
    
    static async UpdateShopCartSkuNumber(params) {
        let res = await this.postForm('vshop', 'ShopCart/UpdateShopCartSkuNumber',params );
        return res;
    }

    //确认订单页面数据
    static async ConfrimShopCartInfo(params) {
        let res = await this.postJson('vshop', 'ShopCart/ConfrimShopCartInfo',params );
        return res;
    }
   
    

}