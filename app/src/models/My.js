const jwt = require('jsonwebtoken');
const { response } = require('express');
const MyStorage = require('./MyStorage');
const UserStorage = require('./UserStorage');

class My{
    constructor(body){
        this.body = body;
    }

    static async mypage(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            
            if (data.id == id) {
                const mypage = await MyStorage.getMypage(id);
                return { success : true, data : mypage.data };
            }

        } catch(err) {
            return { success: false, msg : "재로그인 필요" };
        }
    }

    static async cart(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);

            if (data.id == id) {
                const myCart = await MyStorage.getMyCart(id);
                return { success : true, data : myCart.data };
            }

        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async wishlist(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            
            if (data.id == id) {
                const myWishlist = await MyStorage.getMyWishlist(id);
                return { success : true, data : myWishlist.data };
            }

        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async recommended(){
        try {
            const myRecommended = await MyStorage.getMyRecommended();
            return { success : true, data : myRecommended.data };

        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async order(token){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            
            if (data.id == id) {
                const myOrder = await MyStorage.getMyOrder(id);
                return { success : true, data : myOrder.data };
            }  
            
        } catch(err) {
            return { success: false, msg : err };
        }
    }

    async edit(token ){
        const client = this.body;
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);

            if (data.id == id) {
                await MyStorage.putMyEdit(client, id);
                return { success : true, msg : "회원정보 수정이 완료되었습니다." };
            } 
            
        } catch(err) {
            return { success: false, msg : err };
        }
    }

    async delCart(token){
        const client = this.body;
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);

            if (data.id == id) {
                await MyStorage.delMyCart(client, id);
                return { success : true, msg : "장바구니 내역을 삭제하였습니다." };
            }  
            
        } catch(err) {
            return { success: false, msg : err };
        }
    }

    async delWishlist(token){
        const client = this.body;
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);

            if (data.id == id) {
                await MyStorage.delMyWishlist(client, id);
                return { success : true, msg : "관심상품 내역을 삭제하였습니다." };
            }
            
        } catch(err) {
            return { success: false, msg : err };
        }
    }
}


module.exports = My;