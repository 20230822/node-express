const bodyParser = require('body-parser');
const Product = require('../../models/Product');
const { response } = require('../../../app');

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
    }

}
module.exports = {
    process,
};