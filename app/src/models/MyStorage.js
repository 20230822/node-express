//maria database require
const maria = require('../database/connect/maria');


class MyStorage{

    static getMyCart(id){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM CART_TB WHERE USER_FK = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                console.log(data);
                resolve(data);
            })
        })
    }

    static getMyWishlist(id){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM WISHLIST_TB WHERE USER_FK = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                console.log(data);
                resolve(data);
            })
        })
    }
}

module.exports = MyStorage;