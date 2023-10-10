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
        console.log(response);
        return res.json(response);
    },

    register : async(req, res) => {
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);
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
                secure : false, //http로
                httpOnly : true //js에서 쿠키 접근 불가능
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

    loginSuccess : (req, res) =>{
        try {
            const token = req.cookies.accessToken;
            const response = User.loginSuccess(token);

            if(response.success === true){
                res.status(200).json(id);
            }else{
                res.status(500).json(response.msg);
            }
            
            
        } catch (error) {
            res.status(500).json('ctrl오류');
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