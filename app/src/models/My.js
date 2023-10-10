const jwt = require('jsonwebtoken');
const { response } = require('express');
const MyStorage = require('./MyStorage');
const UserStorage = require('./UserStorage');

class My{

    static async mypage(token, res){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            const mypage = await MyStorage.getMypage(id).then(resp =>{
                return resp ? resp : {};
            });

            if (data.id == id) {
                if (mypage) return { success : true, data : mypage };
                return { success: false, msg: "저장된 정보가 없습니다." };
            }
            else {
                return { success : false, msg : '만료' };
            }  

        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async cart(token, res){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            const myCart = await MyStorage.getMyCart(id).then(resp =>{
                return resp ? resp : {};
            });

            if (data.id == id) {
                if (myCart) return { success : true, data : myCart };
                return { success: false, msg: "장바구니에 담긴 상품이 없습니다." };
            }
            else {
                return { success : false, msg : '만료'};
            }  

        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async wishlist(token, res){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            const myWishlist = await MyStorage.getMyWishlist(id).then(resp =>{
                return resp ? resp : {};
            });
            
            if (data.id == id) {
                if (myWishlist) return { success : true, data : myWishlist };
                return { success: false, msg: "관심상품에 담긴 상품이 없습니다." };
            }
            else{
                return { success : false, msg : '만료'};
            }   

        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async recommended(req, res){
        try {
            const myRecommended = await MyStorage.getMyRecommended(id).then(resp =>{
                return resp ? resp : {};
            });
            
            if (myRecommended) return { success : true, data : myRecommended };
            return { success: false, msg: "추천상품이 없습니다." };

        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async order(token, res){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            const myOrder = await MyStorage.getMyOrder(id).then(resp =>{
                return resp ? resp : {};
            });
            
            if (data.id == id) {
                if (myOrder) return { success : true, data : myOrder };
                return { success: false, msg: "관심상품에 담긴 상품이 없습니다." };
            }
            else {
                return { success : false, msg : '만료' };
            }   
            
        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async edit(token, req){
        const client = req.body;
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            const myEdit = await MyStorage.getMyEdit(client, id).then(resp =>{
                return resp ? resp : {};
            });
            
            if (data.id == id) {
                if (myEdit) return { success : true, data : myEdit };
                return { success: false, msg: "회원정보 수정이 완료되었습니다." };
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