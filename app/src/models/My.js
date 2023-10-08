const { response } = require('express');
const MyStorage = require('./MyStorage');

class My{

    async cart(token, res){
        try{
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const id = await UserStorage.getUserInfo(data.id);
            const myCart = await MyStorage.getMyCart(id).then(resp =>{
                return resp ? resp : {};
            });
            if (data.id == id) {
                if (myCart) return { success: true, msg: "장바구니 가져오기 성공" };
                return { success: false, msg: "장바구니에 담긴 상품이 없습니다." };
            }
            else{
                return { success : false, msg : '만료'};
            }   
        }catch(err){
            return {success: false, msg : err};
        }
    }
}


module.exports = My;