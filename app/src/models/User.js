const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { response } = require('express');
const UserStorage = require('./UserStorage');

class User{
    constructor(body){
        this.body = body;
    }

    async login(req, res){
        const client = this.body;
        try{
            const {USER_ID : id,USER_PW : psword} = await UserStorage.getUserInfo(client.id).then(resp =>{
                return resp ? resp : {};
            });
            
            if(id){
                // 입력된 비밀번호와 저장된 해시된 비밀번호 비교
                const isPasswordValid = bcrypt.compareSync(client.psword, psword);
                const isIdValid = id === client.id;

                if( isIdValid && isPasswordValid ){   //로그인 성공
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
            return {success: false, msg : err};
        }
    }

    async register(req, res){
        const client  = this.body;
        try{
            // 글자수 제한 확인 및 비밀번호 조합 확인
            if (client.id.length < 6 || client.id.length > 40) {
                return { success: false, mag: "아이디는 6~40자로 설정하셔야 합니다." };
            }
            if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(client.psword)){  
                return { success: false, mas: "'비밀번호는 숫자+영문자+특수문자 조합으로 8~25자로 설정하셔야 합니다." };
            }
            if (!/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(client.email)){
                return { success: false, msg: "이메일 형식을 제대로 입력해주세요." };
            }
            if (!/^\d{3}-\d{4}-\d{4}$/.test(client.phone_num)){
                return { success: false, msg: "전화번호를 형식에 맞게 입력해주세요." };
            }
            
            // 아이디 존재 여부, 비밀번호 같은지 확인
            const response = await UserStorage.getUserInfo(client.id).then(resp =>{
                return resp ? resp : {};
            });

            if (response) {
                if (client.psword == client['confirm_psword']) {
                    // 비밀번호 해시 생성
                    const saltRounds = 10; // 솔트 라운드 수 설정
                    const hashedPassword = await bcrypt.hash(client.psword, saltRounds);
                    client.psword = hashedPassword;

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
            const {USER_ID : id,USER_PW : psword} = await UserStorage.getUserInfo(data.id);
            
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
            const {USER_ID : id,USER_PW : psword} = await UserStorage.getUserInfo(data.id);

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
            const {USER_ID : id,USER_PW : psword} = await UserStorage.getUserInfo(data.id);
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