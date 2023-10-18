//maria database require
const maria = require('../database/connect/maria');
const queryExe = require('./common');

class MyStorage{

    static async getMypage(id) {
        const query = "SELECT USER_NM, USER_ID, PROFILE_DATA FROM USER_TB WHERE USER_ID = ?;";
        try{
            [rows, fields] = await queryExe(query, [id]);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async getMyCart(id) {
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
        try{
            [rows, fields] = await queryExe(query, [id]);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async getMyWishlist(id) {
        const query = "SELECT "
            + "W.PRODUCT_FK, "
            + "PI.IMG_DATA "
            + "FROM WISHLIST_TB W "
            + "JOIN PRODUCT_IMG_TB PI ON W.PRODUCT_FK = PI.PRODUCT_FK "
            + "WHERE W.USER_FK = ? "
            + "GROUP BY W.PRODUCT_FK;";
        try {
            [rows, fields] = await queryExe(query, [id]);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async getMyRecommended() {
        const query = "SELECT * FROM RECOMMENDED_TB;";
        try {
            [rows, fields] = await queryExe(query, []);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async getMyOrder(id) {
        const query = "SELECT * FROM ORDER_TB WHERE USER_FK = ?;";
        try {
            [rows, fields] = await queryExe(query, [id]);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async putMyEdit(client, id) {
        const query = "UPDATE USER_TB SET USER_NM = ?, PROFILE_TYPE = ?, PROFILE_DATA = ? WHERE USER_ID = ?;";
        try {
            [rows, fields] = await queryExe(query, [client.name, client.img_type, client.img_data, id]);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async delMyCart(client, id) {
        const query = "DELETE FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
        try {
            [rows, fields] = await queryExe(query, [id, client.product_id]);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async delMyWishlist(client, id) {
        const query = "DELETE FROM WISHLIST_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
        try {
            [rows, fields] = await queryExe(query, [id, client.product_id]);
            if (rows) return {success : true, data: rows};
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }
}

module.exports = MyStorage;