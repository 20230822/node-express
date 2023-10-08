const bodyParser = require('body-parser');

const My = require('../../models/My');
const { response } = require('express');

const process = {
    cart : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await My.cart(token,res);

            if(response.success === true){
                res.status(200).json(response);
            }else{
                res.status(500).json(response.msg);
            }
        } catch {
            res.status(500).json(response.msg);
        }
    },

    wishlist : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await My.wishlist(token,res);
            console.log(response);
            if(response.success === true){
                res.status(200).json(response);
            }else{
                res.status(500).json(response.msg);
            }
        } catch {
            res.status(500).json(response.msg);
        }
    },
}

module.exports = {
    process
};