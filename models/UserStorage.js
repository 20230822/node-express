//maria database require
const maria = require('../database/connect/maria');


class UserStorage{

    static getUserInfo(id){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM user WHERE id = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(err);
                console.log(data);
                resolve(data[0]);
            })
        })
    }
}

module.exports = UserStorage;