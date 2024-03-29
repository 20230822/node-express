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
           const result = await ProductStorage.getProductInfo(this.body.id)
           const images = [];
           if(result.success){
            
            result.data.forEach((row) => {
                const imageData = row.IMG_DATA;
                const imageDate = row.IMG_DT;
                const imageType = row.IMG_TYPE;
                delete row.IMG_DATA;
                delete row.IMG_DT;
                delete row.IMG_TYPE;
                images.push({
                    data : imageData,
                    date : imageDate,
                    type : imageType,
                });

            });
        }

           const response = {success: result.success, data: result.data[0], dataImages : images}
           return response;
        }
        catch(error){
            console.log(error);
            return {success : false, msg: error.message};
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
            return {success : false, msg : error.message};
        }
    }

    async saveImgData(){
        try {
            const response = await ProductStorage.setImgData(this.body);
            return response;
        } catch (error) {
            return {success : false, msg : error.message};
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

    /**
     * token의 사용자의 body의 상품을 위시리스트에서 제거
     * @param {string} token - 사용자 accessToken 값
     * @returns {boolean} - success : 수행 성공여부
     */
    async delWishList(token){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            
            const { USER_ID : id} = await UserStorage.getUserInfo(data.id);
            if(data.id === id){//유저 맞을때
                
                const response = await ProductStorage.delWishList(id, this.body);
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

    /**
     * token의 사용자에게 body의 상품을 사용자의 Cart에 추가
     * @param {string} token - 사용자 accessToken 값
     * @returns {boolean , string} - success : 수행 성공여부
     */
    async addCart(token){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            
            const { USER_ID : id} = await UserStorage.getUserInfo(data.id);
            if(data.id === id){//유저 맞을때
                //카트에 있는지 확인
                //카트에 있다면 수정
                //카트에 없다면 추가
                const response = await ProductStorage.addCart(id, this.body);
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

    /**
     * token의 사용자에게 body의 상품을 사용자의 Cart에서 제거
     * @param {string} token - 사용자 accessToken 값
     * @returns {boolean , string} - success : 수행 성공여부
     */
    async delCart(token){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id} = await UserStorage.getUserInfo(data.id);
            if(data.id === id){//유저 맞을때
                //카트에 있는지 확인
                //카트에 있다면 제거
                const response = await ProductStorage.delCart(id, this.body);
                return response;
            }
            else{
                return { success : false, msg : '만료'};
            }
        }
        catch(error){ //카트에 없다면 에러
            return{success : false, msg: error};
        }
    }

    /**
     * token의 사용자의 카트의 상품의 갯수를 늘림
     * @param {string} token - 사용자 accessToken 값
     * @returns {boolean , string} - success : 수행 성공여부
     */
    async addCartCount(token){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id} = await UserStorage.getUserInfo(data.id);
            if(data.id === id){//유저 맞을때
                //카트에 있는지 확인
                //카트에 있다면 제거
                const response = await ProductStorage.addCartCount(id, this.body);
                return response;
            }
            else{
                return { success : false, msg : '만료'};
            }
        }
        catch(error){ //카트에 없다면 에러
            console.log(error);
            return{success : false, msg: error.message};
        }
    }

    async main(){
        try{
            const response = await ProductStorage.getRandProduct();
            return { success : true, data : response.data };

        }
        catch(error){
            return{ success : false, msg: error };
        }
    }

    async hashtag(){
        const client = this.body;
        try{
            const response = await ProductStorage.getHashtagProduct(client);
            return { success : true, data : response.data };

        }
        catch(error){
            return{ success : false, msg: error };
        }
    }
    

    static async category(body){
        try{
            const response = await ProductStorage.getCategory(body);
            return {success : true, data : response};

        }
        catch(error){
            console.log(error);
            return { success : false , msg : error.message};
        }
    }

    
}

module.exports = Product;