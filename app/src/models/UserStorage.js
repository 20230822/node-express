//maria database require
const maria = require('../database/connect/maria');
//db query execute function
const queryExe = require('./common');


class UserStorage{

    /**
     * id의 유저 정보 DB에서 가져오기
     * @param {int} query - 쿼리문
     * @returns {any} - success : 수행 성공여부
     */
    static async getUserInfo(id){
        
        const query ="SELECT USER_ID, USER_PW FROM USER_TB WHERE USER_ID = ?;";
        try{
            [rows, fields] =  await queryExe(query, [id]);
            if(rows)
            {
                console.log(rows[0]);
                return rows[0];
            }
            throw Error('존재하지 않는 아이디입니다.');
            
        }
        catch(error){
            throw error;
        }

        // try{
        //     const query = "SELECT USER_ID, USER_PW FROM USER_TB WHERE USER_ID = ?;";
        //     const result = await maria.query(query, [id]);

        //     if(result){
        //         console.log(result[0]);
        //         const { USER_ID, USER_PW } = result[0][0];
        //         console.log(USER_ID);
        //         return { USER_ID , USER_PW };
        //     }
        //     else{
        //         throw Error("존재하지 않는 아이디입니다");
        //     }
        // }catch(error){
            
        //     throw error;
        // }
        

    }

    static async save(register){
        // return new Promise((resolve, reject) => {
        //     const query = "INSERT INTO USER_TB(USER_ID, USER_PW, USER_NM, PROFILE_TYPE, PROFILE_DATA) VALUES(?, ?, ?, ?, ?);";
        //     maria.query(query, [register.id, register.psword, register.name, register.img_type, register.img_data]
        //         , (err) => {
        //         if(err) reject(`${err}`);
        //         resolve({
        //             success : true
        //         });
        //     });
        // });   

        const query = "INSERT INTO USER_TB(USER_ID, USER_PW, USER_NM, PROFILE_TYPE, PROFILE_DATA) VALUES(?, ?, ?, ?, ?);";
        try{
            await queryExe(query, [register.id, register.psword, register.name, register.img_type, register.img_data]);
            
            return { success : true } ;
            
        }
        catch(error){
            throw error;
        }
    }

    static async getNotice(){
        const query = "SELECT NOTICE_PK, USER_NM, TITLE, WRITE_DT FROM NOTICE_TB, USER_TB WHERE USER_FK = USER_ID;";
        try{
            await queryExe(query, []);
            return { success : true } ;
        }
        catch(error){
            throw error;
        }
    }

    static async getDetail(page){
        const query = "SELECT USER_NM, TITLE, CONTENT, WRITE_DT FROM NOTICE_TB, USER_TB WHERE USER_FK = USER_ID AND NOTICE_PK = ?;";
        try{
            await queryExe(query, [page]);
            return { success : true } ;
        }
        catch(error){
            throw error;
        }
    }
}

module.exports = UserStorage;