const bodyParser = require('body-parser');

const My = require('../../models/My');
const { response } = require('express');

const process = {

    mypage : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await My.mypage(token);

            if (response.success === true) {
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    cart : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await My.cart(token);

            if (response.success === true) {
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    wishlist : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await My.wishlist(token);
          
            if (response.success === true) {
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    recommended : async (req, res) => {
        try {
            const response = await My.recommended(token);
        
            if (response.success === true) {
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    order : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await My.order(token);
       
            if (response.success === true) {
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },
}

const update = {

    edit : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const my = new My(req.body);
            const response = await my.edit(token);

            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },
}

const del = {

    cart : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const my = new My(req.body);
            const response = await my.delCart(token);

            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    wishlist : async (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const my = new My(req.body);
            const response = await my.delWishlist(token);

            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(500).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },
}

module.exports = {
    process, update, del
};