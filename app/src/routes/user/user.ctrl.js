const bodyParser = require('body-parser');

const User = require('../../models/User');
const { response } = require('express');

const output = {

    home : (req,res) => {
       res.sendFile(path.join('../', '../', '/public/build/index.html'));
   },


}

const process = {
    login : async (req, res) => {
        const user = new User(req.body);
        const response = await user.login(req, res);
        return res.json(response);
    },

    register : async(req, res) => {
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);
    },

    notice : async(req, res) => {
        const response = await User.notice();
        return res.json(response);
    },

    detail: async (req, res) =>{
        const encoded = req.query.page;
        const decoded = decodeURIComponent(encoded);
        const user = new User(decoded);
        const result = await user.detail();
        
        return res.status(200).json(result);
    },

    accessToken : async(req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = await User.accessToken(token);
            if(response.success === true)
            {
                res.status(200).json(response.id);
            }
            else{
                res.status(500).json(response.msg);
            }
            
            
        } catch (error) {
            res.status(500).json('ctrl오류');
        }
    },

    //access token갱신
    refreshToken : async (req, res) => {
        try {
          const token = req.cookies.refreshToken;
          const response =  await User.refreshToken(token);

          if(response.success === true){
            res.cookie('accessToken', response.accessToken,{
                secure : true, //http로
                httpOnly : true, //js에서 쿠키 접근 불가능
                sameSite: 'None'
            });

            res.status(200).json('Access Token Recreated');
          }
          else{
            res.status(500).json(response.msg);
          }
        } catch (error) {
            res.status(500).json(response.msg);
        }
    },

    loginSuccess : async (req, res) =>{
        try {
            const token = req.cookies.accessToken;
            const response = await User.loginSuccess(token);

            if(response.success === true){
                res.status(200).json(response);
            }else{
                res.status(500).json(response);
            }
            
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    
    },
    
    logout : (req, res) => {
        try {
            res.cookie('accessToken', '');
            res.cookie('refreshToken', '');
            res.status(200).json('Logout Success');
        } catch (error) {
            res.status(400).json('Logout Success');
        }
    }

}

module.exports = {
    process,output
};