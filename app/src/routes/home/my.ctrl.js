const bodyParser = require('body-parser');

const My = require('../../models/My');
const { response } = require('express');

const process = {
    cart : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await my.cart(token,res);
            if(response.success === true){
                res.status(200).json(id);
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
            const response = await my.wishlist(token,res);
            if(response.success === true){
                res.status(200).json(id);
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