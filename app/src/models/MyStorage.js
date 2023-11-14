//maria database require
const maria = require('../database/connect/maria');
const queryExe = require('./common');

class MyStorage{

    static async getMypage(id) {
        const query = "SELECT USER_NM, USER_ID, PROFILE_DATA FROM USER_TB WHERE USER_ID = ?;";
        try{
            [rows, fields] = await queryExe(query, [id]);
            if (rows) {
                // rows가 존재하면 IMG_DATA를 base64로 인코딩
                rows = rows.map(row => {
                    if (row.PROFILE_DATA) {
                    // Buffer에 데이터를 바이너리로 로드하고 base64로 인코딩
                    row.PROFILE_DATA = Buffer.from(row.PROFILE_DATA, 'base64').toString();
                    }

                    return row;
                });
                return {success : true, data: rows};
            }
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

            if (rows) {
                // rows가 존재하면 IMG_DATA를 base64로 인코딩
                rows = rows.map(row => {
                    if (row.IMG_DATA) {
                    // Buffer에 데이터를 바이너리로 로드하고 base64로 인코딩
                    row.IMG_DATA = Buffer.from(row.IMG_DATA, 'base64').toString();
                    }

                    return row;
                });
                return {success : true, data: rows};
            }
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
            if (rows) {
                // rows가 존재하면 IMG_DATA를 base64로 인코딩
                rows = rows.map(row => {
                    if (row.IMG_DATA) {
                    // Buffer에 데이터를 바이너리로 로드하고 base64로 인코딩
                    row.IMG_DATA = Buffer.from(row.IMG_DATA, 'base64').toString();
                    }

                    return row;
                });
                return {success : true, data: rows};
            }
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async getMyOrder(id) {
        const query = "SELECT * FROM ORDER_TB WHERE USER_FK = ?;";
        try {
            [rows, fields] = await queryExe(query, [id]);
            if (rows) {
                // rows가 존재하면 IMG_DATA를 base64로 인코딩
                rows = rows.map(row => {
                    if (row.IMG_DATA) {
                        // Buffer에 데이터를 바이너리로 로드하고 base64로 인코딩
                        row.IMG_DATA = Buffer.from(row.IMG_DATA, 'base64').toString();
                    }
                    return row;
                });
                return {success : true, data: rows};
            }
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
        } catch(error) {
            return { success : false, msg : error };
        }
    }

    static async putMyEdit(client, id) {
        let conn;
        try {
            conn = await maria.getConnection();
            await conn.beginTransaction();

            const check_query = "SELECT COUNT(*) AS COUNT FROM USER_TB WHERE USER_ID = ?;";
            const update_query = "UPDATE USER_TB SET USER_NM = ?, PROFILE_TYPE = ?, PROFILE_DATA = ? WHERE USER_ID = ?;";

            const [ rows, fields ] = await conn.query(check_query, [id]);
            const { COUNT : count } = rows[0];

            if (count === 0) {
                await conn.query(update_query, [client.name, client.img_type, client.img_data, id]);   
            }
            
            await conn.commit();
            return { success : false, msg : "트랜잭션 성공" };
            
        } catch(error) {
            await conn.rollback();
            return { success : false, msg : "트랜잭션 오류" };

        } finally {
            conn.relase();
        }
    }

    static async delMyCart(client, id) {
        let conn;
        try {
            conn = await maria.getConnection();
            await conn.beginTransaction();

            const check_query = "SELECT COUNT(*) AS COUNT FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ? ;";
            const delete_query = "DELETE FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ? ;";

            const [rows, fields] = await conn.query(check_query, [id, client.product_id]);
            const { COUNT : count } = rows[0];

            if (count !== 0) {
                await conn.query(delete_query, [id, client.product_id]);
            }

            await conn.commit();
            return { success : true, msg : "트랜잭션 성공" };

        } catch(error) {
            await conn.rollback();
            return { success : false, msg : "트랜잭션 오류" };
        
        } finally {
            conn.relase();
        }
    }

    static async delMyWishlist(client, id) {
        let conn;
        try {
            conn = await maria.getConnection();
            await conn.beginTransaction();

            const check_query = "SELECT COUNT(*) AS COUNT FROM WISHLIST WHERE USER_FK = ? AND PRODUCT_FK = ? ;";
            const delete_query = "DELETE FROM WISHLIST_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";

            const [rows, fields] = await conn.query(check_query, [id, client.product_id]);
            const {COUNT : count} = rows[0];

            if (count !== 0) {
                await conn.query(delete_query, [id, client.product_id]);
            }

            await conn.commit();
            return { success : true, msg : "트랜잭션 성공" };

        } catch(error) {
            await conn.rollback();
            return { success : false, msg : "트랜잭션 오류" };
        } finally {
            conn.relase();
        }
    }
}

module.exports = MyStorage;