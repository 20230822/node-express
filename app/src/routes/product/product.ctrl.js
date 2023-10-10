const bodyParser = require('body-parser');
const Product = require('../../models/Product');

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

    }

}
module.exports = {
    process,
};