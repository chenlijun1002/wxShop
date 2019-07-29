import base from './baseapi'
import wepy from 'wepy';
import Tips from '../utils/Tips';


/**
 * 微页面，主页API接口数据
 */
export default class micropageapi extends base {


    ///获取主页数据
    static async getIndexData() {
        let data={index:"index",rand:`${Math.random()}`};
        let res = await this.get('vshop', 'StoreConfig/GetIndexData', data);
        return res;
    }

    ///获取指定微页面数据
    static async getMicroPageData(pageId) {

        let data={pageId:pageId,rand:`${Math.random()}`};
        let res = await this.get('vshop', 'StoreConfig/GetPageData', data);
        return res;
    }

}