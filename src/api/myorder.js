import base from './baseapi'
import wepy from 'wepy';
import Tips from '../utils/Tips';


/**
 * 微页面，主页API接口数据
 */
export default class myorderApi extends base {


    ///获取商品详情数据
    static async GetProductById(params) {
        //let data={index:"index",rand:`${Math.random()}`};
        let res = await this.get('vshop', 'Product/GetProductById', params);
        return res;
    }
    ///获取店铺全部商品的数量
    static async GetProductCountInfo(params) {
        //let data={index:"index",rand:`${Math.random()}`};
        let res = await this.get('vshop', 'Product/GetProductCountInfo', params);
        return res;
    }

    ///获取商品分类数据
    static async GetTopCategories() {
        let res = await this.get('vshop', 'product/GetFirstGroupList', {rand:`${Math.random()}`});
        return res;
    }

    static async GeChildCategories(topId) {
        let res = await this.get('vshop', 'product/FindSecondGroupListByFirstId', {firstId:topId});
        return res;
    }


    ///商品列表
    static async GeProductList(params) {
        // let params={
        //     pageIndex:pageIndex,
        //     pageSize:pageSize,
        //     productName:searchKey,
        //     sortName:sortName,///SaleNum/SalePrice/Sort
        //     sort:sort,///Asc/Desc
        // };
        let res = await this.get('vshop', 'Product/GetProductListWithPage',params);
        return res;
    }


}
