//maria database require
const maria = require('../database/connect/maria');


class MyStorage{

    static getMypage(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT USER_NM, USER_ID, USER_PROFILE FROM USER_TB WHERE USER_ID = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static getMyCart(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM CART_TB WHERE USER_FK = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static getMyWishlist(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM WISHLIST_TB WHERE USER_FK = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static getMyRecommended() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM RECOMMENDED_TB;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static getMyOrder(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM ORDER_TB WHERE USER_FK = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static putMyEdit(client, id) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE USER_TB SET USER_NM = ?, PROFILE_TYPE = ?, PROFILE_DATA = ? WHERE USER_ID = ?;";
            maria.query(query, [client.name, client.img_type, client.img_data, id], (err, data) => {
                if(err) reject(`${err}`);
                resolve({
                    success : true
                });
            })
        })
    }

    static delMyCart(client, id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
            maria.query(query, [id, client.product_id], (err, data) => {
                if(err) reject(`${err}`);
                resolve({
                    success : true
                });
            })
        })
    }
}

module.exports = MyStorage;