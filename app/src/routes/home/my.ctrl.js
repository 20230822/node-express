const bodyParser = require('body-parser');

const My = require('../../models/My');
const { response } = require('express');

const process = {
    cart : async (req, res) => {
        const my = new My(req.body);
        const response = await my.cart(req,res);
        console.log(response);
        return res.json(response);
    },
}

module.exports = {
    process
};