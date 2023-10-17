//maria database require
const maria = require('../database/connect/maria');


class MyStorage{

    static getMypage(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT USER_NM, USER_ID, PROFILE_DATA FROM USER_TB WHERE USER_ID = ?;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static getMyCart(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT "
            + "P.PRODUCT_NM, "
            + "PI.IMG_DATA, "
            + "P.PRICE, "
            + "C.QUANTITY "
            + "FROM CART_TB C "
            + "JOIN PRODUCT_TB P ON C.PRODUCT_FK = P.PRODUCT_PK "
            + "JOIN PRODUCT_IMG_TB PI ON P.PRODUCT_PK = PI.PRODUCT_FK "
            + "WHERE C.USER_FK = ? "
            + "GROUP BY P.PRODUCT_NM;";
            maria.query(query, [id], (err, data) => {
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }

    static getMyWishlist(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT "
            + "W.PRODUCT_FK, "
            + "PI.IMG_DATA "
            + "FROM WISHLIST_TB W "
            + "JOIN PRODUCT_IMG_TB PI ON W.PRODUCT_FK = PI.PRODUCT_FK "
            + "WHERE W.USER_FK = ? "
            + "GROUP BY W.PRODUCT_FK;";
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

    static delMyWishlist(client, id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM WISHLIST_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
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