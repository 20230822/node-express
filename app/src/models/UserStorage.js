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

    static save(register, imageBuffer){
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
}

module.exports = UserStorage;