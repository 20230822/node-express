const bodyParser = require('body-parser');
const Product = require('../../models/Product');
const { response } = require('../../../app');
const MyStorage = require('../../models/MyStorage');

const process = {
    detailInfo : async (req, res) => {
        //상품 정보 db에서 가져와서 리턴
        const product = new Product(req.body);
        const response = await product.getProductData();
        console.debug(response);
        return res.status(200).json(response);
        
    },
    saveProduct : async (req, res) => {
        //body로 받은 데이터 저장
        const product = new Product(req.body);
        const response = await product.setProductData();
        return res.status(200).json(response);

    },

    // edit: async (req,res) =>{
    //     //body로 받은 데이터로 정보 수정



    // },

    search: async (req, res) =>{
        //키워드 받아서 select like문
        const encoded = req.query.keyword
        const decoded = decodeURIComponent(encoded);
        const product = new Product(decoded);
        const result = await product.search();
        console.log(result[0]);
        return res.status(200).json(result);
    },

    addWishList : async (req, res) =>{
        try {
            //쿠키의 토큰 받아서 로그인 했는지 확인
            const token = req.cookies.accessToken;
            //로그인 안했으면 로그인 하도록(fe)
            
            //로그인 했으면 위시 리스트에 들어있는지 확인하고 
            const product = new Product(req.body);
            const response = await product.addWishList(token);
            if(response.success == true){
                res.status(200).json(response);
            }
            else{
                res.status(500).json(response);
            }
            

        } catch (error) {
            res.status(500).json({success : false, msg : error});
        }
        
        
        //로그인 했으면 위시 리스트에 들어있는지 확인하고 
        //없으면 넣어주고
        //이미 들어 있으면 이미 들어있다고
    }
}
module.exports = {
    process,
};