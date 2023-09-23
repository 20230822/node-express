const bodyParser = require('body-parser');
const User = require('../../models/User');

const output = {

    home : (req,res) => {
       res.render('home/index');
   },
   login : (req, res)=>{
   res.render('home/login');
   }

}

const process = {
    login : async (req, res) => {
        const user = new User(req.body);
        const response = await user.login(req,res);
        return res.json(response);
    },

    register : async(req, res) => {
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);
    },

    accessToken : (req, res) => {
        try {
            const token = req.cookies.accessToken;
            const response = User.accessToken(token);
            if(response.success == true){
                res.status(200).json(response.userData)
            }
        } catch (error) {
            
        }
    },

    refreshToken : (req, res) => {

    },

    loginSuccess : (req, res) =>{

    },
    
    logout : (req, res) => {
        try {
            res.cookie('accessToken', '');
            res.status(200).json('Logout Success');
        } catch (error) {
            res.status(400).json('Logout Success');
        }
    }

}

module.exports = {
    process,output
};