const jwt = require('jsonwebtoken');
const { response } = require('express');
const UserStorage = require('./UserStorage');

class User{
    constructor(body){
        this.body = body;
    }

    async login(req, res){
        const client = this.body;
        try{
            
            const {id, psword} = await UserStorage.getUserInfo(client.id);
            console.log(id, psword);

            if(id){
                if(id === client.id && psword === client.psword){   //로그인 성공
                    //access Token발급
                    const accessToken = jwt.sign({
                        id
                    },process.env.SECRET_ACCESS_KEY
                    ,{expiresIn: '5m' , issuer : 'realcold0'});

                    //refresh Token 발급
                    const refreshToken = jwt.sign({
                        id
                    },process.env.SECRET_REFRESH_KEY
                    ,{expiresIn: '24h' , issuer : 'realcold0'});

                    console.log("accessToken " +accessToken,"\n refreshToken " + refreshToken);
                     
                    //토큰값 쿠키에 담아서 전송
                    res.cookie('accessToken', accessToken,{
                        secure : false, //http로
                        httpOnly : true //js에서 쿠키 접근 불가능
                    });
                    res.cookie('refreshToken', refreshToken,{
                        secure : false, //http로
                        httpOnly : true //js에서 쿠키 접근 불가능
                    });
                    return { success : true , msg : "로그인 성공"};

                }
                return { success : false , msg : "비밀번호가 틀렸습니다."};

            }
            return { success : false, msg : "존재하지 않는 아이디입니다."};
        }catch(err){
            return {success: false,msg :err};
        }
    }

    async register(){
        const client  = this.body;
        try{
            // 글자수 제한 확인
            if (client.id.length < 6 || client.id.length > 40) {
                return { success: false, mag: "아이디는 6~40자로 설정하셔야 합니다." }
            }
            if (client.psword.length < 8 || client.psword.length > 40) {
                return { success: false, msg: "비밀번호는 8~40자로 설정하셔야 합니다." }
            }

            // 아이디 존재 여부, 비밀번호 같은지 확인
            const response = await UserStorage.getUserInfo(client.id);
            if (!response) {
                if (client.psword == client['confirm-psword']) {
                    const response = await UserStorage.save(client);
                    return response;
                }
                return { success: false, msg : "비밀번호가 다릅니다." };
            }
            return { success: false, msg : "이미 존재하는 아이디입니다." };
        }catch(err){
            throw(err);

        }
        
    }

    static async accessToken(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const {id,psword} = await UserStorage.getUserInfo(data.id);
            
            if(data.id === id){
                return { success : true , id : id};
            }else{
                return { success : false, msg : '만료'};
            }

        } catch (error) {
            return { success : false, msg : error};
        }
        
        
    }
    static async refreshToken(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
            const {id,psword} = await UserStorage.getUserInfo(data.id);
            if(data.id === id){
                const accessToken = jwt.sign({
                    id
                },process.env.SECRET_ACCESS_KEY
                ,{expiresIn: '5m' , issuer : 'realcold0'});

                //토큰값 쿠키에 담아서 전송
                return {success : true, accessToken : accessToken};
                
            }else{
                return { success : false, msg : '만료'};
            }

        } catch (error) {
            return { success : false, msg : 'error'};
        }
        
        
    }

    static async loginSuccess(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const {id,psword} = await UserStorage.getUserInfo(data.id);
            if(data.id === id){
                return {success : true, id: id};
                
            }else{
                return { success : false, msg : '만료'};
            }

        } catch (error) {
            return { success : false, msg : 'error'};
        }
        
        
    }
}


module.exports = User;