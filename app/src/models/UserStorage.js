//maria database require
const maria = require('../database/connect/maria');


class UserStorage{

    static getUserInfo(id){
        return new Promise((resolve, reject) => {
            const query = "SELECT USER_ID, USER_PW FROM USER_TB WHERE USER_ID = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data[0]);
            })
        })
    }

    static save(register){
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO USER_TB(USER_ID, USER_PW, USER_NM, PROFILE_TYPE, PROFILE_DATA) VALUES(?, ?, ?, ?, ?);";
            maria.query(query, [register.id, register.psword, register.name, register.img_type, register.img_data]
                , (err) => {
                if(err) reject(`${err}`);
                resolve({
                    success : true
                });
            });
        });   
    }

    static getNotice(){
        return new Promise((resolve, reject) => {
            const query = "SELECT NOTICE_PK, USER_NM, TITLE, WRITE_DT FROM NOTICE_TB, USER_TB WHERE USER_FK = USER_ID;";
            maria.query(query, (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static getDetail(client){
        return new Promise((resolve, reject) => {
            const query = "SELECT USER_NM, TITLE, CONTENT, WRITE_DT FROM NOTICE_TB, USER_TB WHERE USER_FK = USER_ID AND NOTICE_PK = ?;";
            maria.query(query, [client], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }
}

module.exports = UserStorage;