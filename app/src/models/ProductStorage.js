//maria database require
const maria = require('../database/connect/maria');
const queryExe = require('./common');

class ProductStorage{
    static async getProductInfo(id) {
        
        const query ="SELECT * FROM  PRODUCT_TB WHERE PRODUCT_PK = ?;";
        try{
            [rows, fields] =  await queryExe(query, [id]);
            if(rows)
            {
                return {success : true, data: rows};
            }
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
            
        }
        catch(error){
            return { success : false, msg : error } ;
        }
        // return new Promise((resolve, reject) => {
        //     const query = "SELECT * FROM  PRODUCT_TB WHERE PRODUCT_PK = ?;";
        //     maria.query(query, [id], (err,data) =>{
        //         if(err) reject(`${err}`);
        //         resolve(data[0]);
        //     });
        // });


    }

    static async setProductInfo(prod){

        const query ="INSERT INTO PRODUCT_TB(CARTEGORY_FK, STOCK_AMT, PRICE, PRODUCT_NM, SIZE, MATERIAL, WEIGHT, TEMPERATURE, LIGHT_TYPE, COUNTRY , COLOR, `DESCRIBE`, `HASHTAG`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );";
        try{
             await queryExe(query, [prod.category, prod.stock, prod.price, prod.name, prod.size, prod.material, prod.weight, prod.tem, prod.ltype, prod.coun ,prod.color, prod.describe, prod.hashtag]);
            return {success : true};
        }
        catch(error){
            return { success : false, msg : error } ;
        }

        // return new Promise((resolve, reject) => {
        //     const query = "INSERT INTO PRODUCT_TB(CARTEGORY_FK, STOCK_AMT, PRICE, PRODUCT_NM, COLOR, `DESCRIBE`, `HASHTAG`) VALUES(?, ?, ?, ?, ?, ?, ?);"
        //     maria.query(query, [prod.category, prod.stock, prod.price, prod.name, prod.color, prod.describe, prod.hashtag]
        //         , (err) =>{
        //         if(err) reject(`${err}`);
        //         console.log('insert product! ');
        //         resolve({
        //             success : true
        //         });
        //     });

            
        // });

       


    }
    static async searchProduct(searchKeyword){
        const query = "SELECT * FROM PRODUCT_TB WHERE PRODUCT_NM LIKE ? OR COLOR LIKE ? OR HASHTAG LIKE ?;";
        try{
            const [rows, fields] = await queryExe(query, [`%${searchKeyword}%`, `%${searchKeyword}%`, `%${searchKeyword}%`]);
            return {success : true, data : rows};
        }
        catch(error){
            return { success : false, msg : error } ;
        }
        // let conn;
        // try{
        //     conn = await maria.getConnection();
        //     const query = "SELECT * FROM PRODUCT_TB WHERE PRODUCT_NM LIKE ? OR COLOR LIKE ? OR HASHTAG LIKE ?;";
        //     const [rows, fields] = await conn.query(query, [`%${searchKeyword}%`, `%${searchKeyword}%`, `%${searchKeyword}%`]);
        //     return {success : true, data : rows};
            

        // }catch(error){
        //     console.log(error);
        //     return{ success : false, msg : "DB 오류"} ;
        // }finally{
        //     conn.release();
        // }

    }
    static async addWishList(userId, product){
        let conn;
        try{
            conn = await maria.getConnection();
            await conn.beginTransaction();

            const query1 = "INSERT INTO WISHLIST_TB(PRODUCT_FK, USER_FK) VALUES(?, ?);";
            const query2 = "UPDATE PRODUCT_TB SET WISHLIST_CNT = WISHLIST_CNT + 1 WHERE PRODUCT_PK = ?;";
            
            await conn.query(query1, [product.productId, userId]);
            
            await conn.query(query2, [product.productId]);
            
            await conn.commit();
            return { success : true, msg : "트랜잭션 성공"};

        }catch(error){
            await conn.rollback();
            console.log(error);
            return{ success : false, msg : "트랜잭션 오류"} ;
        }finally{
            conn.release();
        }
    }
}

module.exports = ProductStorage;