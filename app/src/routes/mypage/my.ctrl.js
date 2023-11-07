const bodyParser = require('body-parser');

const My = require('../../models/My');
const { response } = require('express');

const process = {

    mypage : async (req, res) => {
        try {
            // 쿠키의 토큰으로 로그인 유효성 확인
            const token = req.cookies.accessToken;
            // 마이페이지의 정보 가져오기
            const response = await My.mypage(token);

            // 로그인 유효할 경우
            if (response.success === true) {
                // 마이페이지의 정보 반환
                res.status(201).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    cart : async (req, res) => {
        try {
            // 쿠키의 토큰으로 로그인 유효성 확인
            const token = req.cookies.accessToken;
            // 해당 회원의 장바구니의 정보 가져오기
            const response = await My.cart(token);

            // 로그인 유효할 경우
            if (response.success === true) {
                // 해당 회원의 장바구니의 정보 반환
                res.status(201).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    wishlist : async (req, res) => {
        try {
            // 쿠키의 토큰으로 로그인 유효성 확인
            const token = req.cookies.accessToken;
            // 해당 회원의 관심상품의 정보 가져오기
            const response = await My.wishlist(token);
          
            // 로그인 유효할 경우
            if (response.success === true) {
                // 관심상품의 정보 반환
                res.status(201).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    order : async (req, res) => {
        try {
            // 쿠키의 토큰으로 로그인 유효성 확인
            const token = req.cookies.accessToken;
            // 관심상품의 정보 가져오기
            const response = await My.order(token);
       
            // 로그인 유효할 경우
            if (response.success === true) {
                // 관심상품의 정보 반환
                res.status(201).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },
}

const update = {

    edit : async (req, res) => {
        try {
            // 쿠키의 토큰으로 로그인 유효성 확인
            const token = req.cookies.accessToken;

            // 해당 회원이 존재하는지 확인 후 회원정보 업데이트
            const my = new My(req.body);
            const response = await my.edit(token);

            // 로그인 유효할 경우
            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },
}

const del = {

    cart : async (req, res) => {
        try {
            // 쿠키의 토큰으로 로그인 유효성 확인
            const token = req.cookies.accessToken;

            // 해당 장바구니 내역이 존재하는지 확인 후 삭제
            const my = new My(req.body);
            const response = await my.delCart(token);

            // 로그인 유효할 경우
            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },

    wishlist : async (req, res) => {
        try {
            // 쿠키의 토큰으로 로그인 유효성 확인
            const token = req.cookies.accessToken;

            // 해당 관심상품이 존재하는지 확인 후 삭제
            const my = new My(req.body);
            const response = await my.delWishlist(token);

            // 로그인 유효할 경우
            if (response.success === true){
                res.status(200).json(response);
            } else {
                res.status(401).json(response.msg);
            }

        } catch {
            res.status(500).json(response.msg);
        }
    },
}

module.exports = {
    process, update, del
};