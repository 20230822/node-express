//maria database require
const maria = require('../database/connect/maria');


class UserStorage{

    static getUserInfo(id){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM user WHERE id = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                console.log(data);
                resolve(data[0]);
            })
        })
    }

    static save(userInfo){
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO user(id, psword, name, email,phone_num,adress) VALUES(?, ?, ?, ?, ?, ?);";
            maria.query(query, [userInfo.id, userInfo.psword, userInfo.name, userInfo.email, userInfo. phone_num, userInfo.adress]
                , (err) => {
                if(err) reject(`${err}`);
                console.log('회원가입');
                resolve({
                    success : true
                });
            });
        });   
    }
}

module.exports = UserStorage;