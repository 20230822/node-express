const ProductStorage = require('./ProductStorage');
class Product{
    
    constructor(body){
        this.body = body;
    }

    async getProductData(){
        try{
            const  {PRODUCT_PK : id, CARTEGORY_FK : cartegory, REGISTER_DT : register, 
                STOCK_AMT : stock, PRICE : price, PRODUCT_NUM : productNum, COLOR : color, DESCRIBE : des, 
                HASHTAG : hashtag }
             = await ProductStorage.getProductInfo(this.body.id).then(resp => {
                return resp ? resp : {};
             });
            
             return {
                success : true,
                PRODUCT_PK : id, 
                CARTEGORY_FK : cartegory, 
                REGISTER_DT : register, 
                STOCK_AMT : stock, 
                PRICE : price, 
                PRODUCT_NUM : productNum, 
                COLOR : color, 
                DESCRIBE : des, 
                HASHTAG : hashtag
            };
        }
        catch{
            return {success : false, msg : "상품 정보가 없습니다."};
        }
    }

    async setProductData(){
        try {
            
            //데이터 저장
            const response = await ProductStorage.setProductInfo(this.body);
            return response;
            
        }catch (error) {
            return {success : false, msg : error};
        }
    }

    async search(){
        try{
            console.log(this.body);
            const response = await ProductStorage.searchProduct(this.body);
            return response;
        }catch(error){
            return { success : false , msg : error};
        }
    }
}

module.exports = Product;