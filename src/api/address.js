import base from './baseapi'
import wepy from 'wepy';
import Tips from '../utils/Tips';


/**
 * 收货地址，主页API接口数据
 */

 export default class addressapi extends base {
     static async GetMemberAddress(params) {
         let res = await this.get('vshop', 'Address/GetMemberAddress', params);
         return res;
     }

     static async AddWeixinAddress(params) {
        let res = await this.postForm('vshop', 'Address/AddWeixinAddress', params);
        return res;
    }

    static async GetBaseAreas(params) {
        let res = await this.get('vshop', 'Address/GetBaseAreas', params);
        return res;
    }

    static async GetMemberAddressById(params) {
        let res = await this.get('vshop', 'Address/GetMemberAddressById', params);
        return res;
    }

    
 }