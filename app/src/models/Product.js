const ProductStorage = require('./ProductStorage');
const jwt = require('jsonwebtoken');
const UserStorage = require('./UserStorage');
class Product{
    
    constructor(body){
        this.body = body;
    }

    
    /**
     * 해당 상품의 정보를 불러옴
     * @returns {any} - success : 수행 성공여부, data : 상품 정보
     */
    async getProductData(){
        try{
           const response = await ProductStorage.getProductInfo(this.body.id)
             return {
                success : true,
                data : response.data
            };
        }
        catch{
            return {success : false, msg : "상품 정보가 없습니다."};
        }
    }

    /**
     * 상품 정보 등록
     * @returns {any} - success : 수행 성공여부
     */
    async setProductData(){
        try {
            
            //데이터 저장
            const response = await ProductStorage.setProductInfo(this.body);
            
            return response;
            
        }catch (error) {
            return {success : false, msg : error};
        }
    }

    /**
     * 상품 검색
     * @returns {any} - success : 수행 성공여부
     */
    async search(){
        try{
            const response = await ProductStorage.searchProduct(this.body);
            return response;
        }catch(error){
            return { success : false , msg : error};
        }
    }


    /**
     * token의 사용자에게 body의 상품을 위시리스트 등록 후 성공여부 반환
     * @param {string} token - 사용자 accessToken 값
     * @returns {boolean , string} - success : 수행 성공여부
     */
    async addWishList(token){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            
            const { USER_ID : id} = await UserStorage.getUserInfo(data.id);
            if(data.id === id){//유저 맞을때
                
                const response = await ProductStorage.addWishList(id, this.body);
                return response;
            }
            else{
                return { success : false, msg : '만료'};
            }
        }
        catch(error){
            return{success : false, msg: error};
        }
    }
    
}

module.exports = Product;