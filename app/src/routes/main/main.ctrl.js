const bodyParser = require('body-parser');
const Product = require('../../models/Product');
const { response } = require('../../../app');

const process = {

    main : async (req, res) => {
        try {
            const product = new Product();
            const response = await product.main();

            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch(error) {
            console.log(error);
            res.status(500).json();
        }
    },
    
    hashtag : async (req, res) => {
        try {
            const product = new Product(req.body);
            const response = await product.hashtag();
            
            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch(error) {
            console.log(error);
            res.status(500).json(response.msg);
        }
    },
}

module.exports = {
    process
};