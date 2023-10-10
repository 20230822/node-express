//maria database require
const maria = require('../database/connect/maria');


class UserStorage{

    static getUserInfo(id){
        return new Promise((resolve, reject) => {
            const query = "SELECT USER_ID, USER_PW FROM USER_TB WHERE USER_ID = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                console.log(data);
                resolve(data[0]);
            })
        })
    }

    static save(userInfo){
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO USER_TB(USER_ID, USER_PW, USER_NM, USER_PROFILE) VALUES(?, ?, ?, ?);";
            maria.query(query, [userInfo.id, userInfo.psword, userInfo.name, userInfo.email, userInfo. phone_num, userInfo.adress, userInfo.profile, userInfo.birthday]
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