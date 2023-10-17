const ProductStorage = require('./ProductStorage');
const jwt = require('jsonwebtoken');
const UserStorage = require('./UserStorage');
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
            const response = await ProductStorage.searchProduct(this.body);
            return response;
        }catch(error){
            return { success : false , msg : error};
        }
    }


    async addWishList(token){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            
            const { USER_ID : id} = await UserStorage.getUserInfo(data.id);
            console.log('a');
            if(data.id === id){//유저 맞을때
                
                const response = await ProductStorage.addWishList(id, this.body);
                console.log('b');
                return response;
            }
            else{
                console.log('c');
                return { success : false, msg : '만료'};
            }
        }
        catch(error){
            return{success : false, msg: error};
        }
    }
    
}

module.exports = Product;