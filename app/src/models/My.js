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
            else {
                return { success : false, msg : '만료' };
            }  

        } catch(err) {
            return { success: false, msg : err };
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
            else {
                return { success : false, msg : '만료'};
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
            else{
                return { success : false, msg : '만료'};
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
            else {
                return { success : false, msg : '만료' };
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
            const myEdit = await MyStorage.putMyEdit(client, id).then(resp =>{
                return resp ? resp : {};
            });

            if (data.id == id) {
                if (myEdit) return { success : true, msg : "회원정보 수정이 완료되었습니다." };
                return { success: false, msg: "회원정보 수정이 처리되지 않았습니다." };
            }
            else {
                return { success : false, msg : '만료' };
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
            const myCart = await MyStorage.delMyCart(client, id).then(resp =>{
                return resp ? resp : {};
            });

            if (data.id == id) {
                if (myCart) return { success : true, msg : "장바구니 내역을 삭제하였습니다." };
                return { success: false, msg: "장바구니 내역 삭제가 처리되지 않았습니다." };
            }
            else {
                return { success : false, msg : '만료' };
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
            const myWishlist = await MyStorage.delMyWishlist(client, id).then(resp =>{
                return resp ? resp : {};
            });

            if (data.id == id) {
                if (myWishlist) return { success : true, msg : "관심상품 내역을 삭제하였습니다." };
                return { success: false, msg: "관심상품 내역 삭제가 처리되지 않았습니다." };
            }
            else {
                return { success : false, msg : '만료' };
            }   
            
        } catch(err) {
            return { success: false, msg : err };
        }
    }
}


module.exports = My;