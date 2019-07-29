import { VantComponent } from '../vant/common/component';
import Toast from '../vant/toast/toast';
import wxutils from '../../utils/WxUtils';

VantComponent({
  props: {
    visible:Boolean,
    sku:Object,   
    value: String,
    loading: Boolean, 
    styleConfig:Object,   
  },
  data: {    
    selectSku:[],
    selectedSkuValue:'',
    selectedSkuValueText:'',
    selectedSkuValueTextList:[],
    productNum:1,
    addCartLoading:false,
    datetimeIndex:'',
    showDatetime:false,
  },
  // computed: {
  //   displayColumns: function displayColumns() {
  //     var _this$data = this.data,
  //         _this$data$columns = _this$data.columns,
  //         columns = _this$data$columns === void 0 ? [] : _this$data$columns,
  //         columnsNum = _this$data.columnsNum;
  //     return columns.slice(0, +columnsNum);
  //   }
  // },
  // watch: {
  //   value: function value(_value) {
  //     this.code = _value;
  //     this.setValues();
  //   },
  //   areaList: 'setValues'
  // },
  lifetimes:{
    attached:function(){
      console.log(this,9999999)
    },
    created:function(){
      console.log(this,888)
    },
  },   
  methods: {
    selectedSp (e) {
      console.log(this)
      let pidx=e.target.dataset.pidx;
      let cidx=e.target.dataset.cidx;
      let value=e.target.dataset.value;      
      let list = JSON.parse(JSON.stringify(this.data.sku.skuList));
      let skuList = JSON.parse(JSON.stringify(this.data.sku.skuList));
      list[pidx].Sku_Value.forEach((item)=>{
        item.selected=false;
      })
       list[pidx].Sku_Value[cidx].selected=true;
      this.data.sku.skuList=list;      
      let index=this.data.selectSku.findIndex((item)=>item===value.Id);
      if(index<0){
         //this.selectSku.push(id);
         this.data.selectSku[pidx]=value.Id;
         this.data.selectedSkuValueTextList[pidx]=value.Text;
      }    
     // this.selectSku=selectSku;      
    let arr=JSON.parse(JSON.stringify(this.data.selectSku));
     arr.sort(function (a,b) {
        return a-b;
      })
      this.data.selectedSkuValueText=this.data.selectedSkuValueTextList.join('，');
      this.data.selectedSkuValue=`${this.data.sku.goods.id}_${arr.join('_')}`; 
      let filter=this.data.selectSku.filter((item)=>item);
      if(this.data.sku.skuList.length===filter.length){
        for(let i=0;i<this.data.sku.list.length;i++){
          let item=this.data.sku.list[i];
          if(this.data.selectedSkuValue===item.SkuId){          
            this.data.sku.goods.price=item.SalePrice;
           // this.sku.goods.SaleNum=item.SaleNum;
            this.data.sku.goods.stockNum=item.StockNum;
            if(pidx==0&&this.data.sku.skuList[pidx].Sku_Value[cidx].ImgPath){
              this.data.sku.goods.picture=`${this.data.sku.goods.cdnUrl}/${this.data.sku.skuList[pidx].Sku_Value[cidx].ImgPath}`;             
            }
            if(item.StockNum<this.data.productNum){
              this.setData({
                productNum:item.StockNum,
              })
            }
            break;
          }
        }
      }
      
      this.setData({sku:this.data.sku,selectedSkuValueText:this.data.selectedSkuValueText,selectedSkuValueTextList:this.data.selectedSkuValueTextList,selectedSkuValue:this.data.selectedSkuValue});     
      this.$emit('selectSkus',this.data.selectedSkuValueTextList);    
    },
    onCancel: function onCancel() {     
      this.$emit('close');
    },
    onConfirm: function onConfirm() {
      this.$emit('confirm', {
        values: this.getValues(),
        indexs: this.getIndexs(),
        detail: this.getDetail()
      });
    },
    onChange: function onChange(e) {           
      this.setData({
        productNum:parseInt(e.detail),
      })
      
    },
    addCart: function addCart(type, code) {          
      if(!this.data.selectedSkuValueTextList[0]&&this.data.sku.skuList.length>=1){
        Toast({message:`请选择${this.data.sku.skuList[0].Text}`,duration:1000}); 
        return;
      }
      if(!this.data.selectedSkuValueTextList[1]&&this.data.sku.skuList.length>=2){
        Toast({message:`请选择${this.data.sku.skuList[1].Text}`,duration:1000}); 
        return;
      }
      if(!this.data.selectedSkuValueTextList[2]&&this.data.sku.skuList.length>=3){
        Toast({message:`请选择${this.data.sku.skuList[2].Text}`,duration:1000}); 
        return;
      }
      // this.setData({
      //   addCartLoading:true
      // })
      this.loadingShow();
      // setTimeout(()=>{
      //   Toast({message:'加入成功',duration:2000});        
      //   this.setData({
      //     addCartLoading:false
      //   })
      //   this.$emit('close');
      //   this.$emit('onAddCart');
      // },2000)
      //this.$emit('close');      
      this.$emit('onAddCart',{
        productNum:this.data.productNum,
        skuId:this.data.selectedSkuValue,
        skuText:this.data.selectedSkuValueText,
        productId:this.data.sku.goods.id,
        productImg:this.data.sku.goods.picture,
        showLoading:this.loadingShow.bind(this),
        hideLoading:this.loadingHide.bind(this)
      });
    },
    loadingHide:function(){
      this.setData({
          addCartLoading:false
      })
    },
    loadingShow:function(){
      this.setData({
          addCartLoading:true
      })
    },
    buyNow: function buyNow(type, code) {
      if(!this.data.selectedSkuValueTextList[0]&&this.data.sku.skuList.length>=1){
        Toast({message:`请选择${this.data.sku.skuList[0].Text}`,duration:1000}); 
        return;
      }
      if(!this.data.selectedSkuValueTextList[1]&&this.data.sku.skuList.length>=2){
        Toast({message:`请选择${this.data.sku.skuList[1].Text}`,duration:1000}); 
        return;
      }
      if(!this.data.selectedSkuValueTextList[2]&&this.data.sku.skuList.length>=3){
        Toast({message:`请选择${this.data.sku.skuList[2].Text}`,duration:1000}); 
        return;
      }
      Toast({message:'正在开发中',duration:1000}); 
    },
    onCloseDatetime(){     
      this.setData({
        showDatetime:false
      })
    },
    showDatetimePup(e){
      let index= e.target.dataset.index;
      console.log(index)
      // this.datetimeIndex=num;
      // this.showDatetime=true;
      this.setData({
        datetimeIndex:index,
        showDatetime:true
      })
    },
    selectDatetime(val){      
      // this.pageData.Message[this.datetimeIndex].text=this.date('Y-m-d H:i:s',`${val.detail}`); 
       this.data.sku.message[this.datetimeIndex].text=wxutils.date(`${val.detail}`.substr(0,`${val.detail}`.length-3));
      // this.showDatetime=false;
      this.setData({
        sku:this.data.sku,
        showDatetime:false
      })
    },
    changeInput(e){
      let text=e.detail.value||e.detail;
      let index=e.target.dataset.index;
      let type = e.target.dataset.datatype;
     // this.pageData.Message[index].text=text; 
      this.data.sku.message[index].text=text;      
      console.log(type)  
      if(type === 'phoneNo'){
        let reg=/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[89])[0-9]{8}$/;
        if(text.match(reg)){
          this.data.sku.message[index].error=false;   
        }else{
          this.data.sku.message[index].error=true; 
        }
      }else if(type === 'mail'){
        let reg=/^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
        if(text.match(reg)){
          this.data.sku.message[index].error=false;   
        }else{
          this.data.sku.message[index].error=true; 
        }
      }else if(type === 'idCard'){
        let reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(text.match(reg)){
          this.data.sku.message[index].error=false;   
        }else{
          this.data.sku.message[index].error=true; 
        }
      }
      this.setData({
        sku:this.data.sku,
      }) 
    },
    chooseImage(e){
      // let text=e.detail;
      let index=e.currentTarget.dataset.index;
      //let type = e.target.dataset.datatype;
      const that=this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths)
          that.data.sku.message[index].text=tempFilePaths[0];         
          that.setData({
            sku:that.data.sku,          
          })
        }
      })
    }
  }  
});