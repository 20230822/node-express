const { response } = require('express');
const MyStorage = require('./MyStorage');

class My{
    constructor(body){
        this.body = body;
    }

    async cart(req, res){
        const client = this.body;
        try{
            const myCart = await MyStorage.getMyCart(client.id).then(resp =>{
                return resp ? resp : {};
            });
            if (myCart) return { success: true, msg: "장바구니 가져오기 성공" };
            return { success: false, msg: "장바구니에 담긴 상품이 없습니다." };
        }catch(err){
            return {success: false, msg : err};
        }
    }
}


module.exports = My;