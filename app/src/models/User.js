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
        try {
            const { USER_ID : id, USER_PW : psword} =  await UserStorage.getUserInfo(client.id)
            console.log(id);
            if(id)
            {
                //입력된 비밀번호와 저장된 해시된 비밀번호 비교
                const isPasswordValid = bcrypt.compareSync(client.psword, psword);
                const isIdValid = id === client.id;

                if (isIdValid && isPasswordValid) {   //로그인 성공
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
                        secure : true, //https로
                        httpOnly : true, //js에서 쿠키 접근 불가능
                        sameSite: 'none'
                    });
                    res.cookie('refreshToken', refreshToken,{
                        secure : true, //https로
                        httpOnly : true, //js에서 쿠키 접근 불가능
                        sameSite: 'none'
                    });
                    return { success : true , msg : "로그인 성공" };
                }
                return { success : false , msg : "비밀번호가 틀렸습니다." };
                
            }
            return { success : false, msg : "존재하지 않는 아이디입니다." };
            
        } catch (err) {
            return { success: false, msg : err.message };
        }
    }

    async register(){
        const client  = this.body;
        try {
            // 글자수 제한 확인 및 비밀번호 조합 확인
            if (!/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(client.id)){
                return { success: false, msg: "아이디를 이메일 형식으로 입력해주세요." };
            }
            if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(client.psword)){  
                return { success: false, msg: "'비밀번호는 숫자+영문자+특수문자 조합으로 8~25자로 설정하셔야 합니다." };
            }
            
            // 아이디 존재 여부, 비밀번호 같은지 확인
            const { USER_ID : id }  = await UserStorage.getUserInfo(client.id);

            if (!id) { //아이디가 존재 하지 않는다면
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
        } catch (err) {
            throw(err);
        } 
    }

    static async notice(){
        try{
            const notice = await UserStorage.getNotice();    
            return { success : true, data : notice.data };            
        } catch(err) {
            return { success: false, msg : err };
        }
    }

    async detail(){
        const page = this.body;
        try{
            const detail = await UserStorage.getDetail(page);
            return { success : true, data : detail.data };         
        } catch(err) {
            return { success: false, msg : err };
        }
    }

    static async accessToken(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            
            if(data.id === id){
                return { success : true , id : id };
            }else{
                return { success : false, msg : '만료' };
            }

        } catch (err) {
            return { success : false, msg : err };
        } 
    }

    static async refreshToken(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);

            if (data.id === id){
                const accessToken = jwt.sign({
                    id
                }
                , process.env.SECRET_ACCESS_KEY
                , { expiresIn : '5m' , issuer : 'realcold0' }
                );

                //토큰값 쿠키에 담아서 전송
                return { success : true, accessToken : accessToken };
                
            } else {
                return { success : false, msg : '만료' };
            }

        } catch (err) {
            return { success : false, msg : err };
        }
    }

    static async loginSuccess(token){
        try {
            const data = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            const { USER_ID : id } = await UserStorage.getUserInfo(data.id);
            if ( data.id === id ){
                return { success : true, id: id }; 
            } else {
                return { success : false, msg : '만료' };
            }

        } catch (err) {
            return { success : false, msg : err };
        } 
    }
}


module.exports = User;