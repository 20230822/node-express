//maria database require
const maria = require('../database/connect/maria');
//db query execute function
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

            //위시리스트에 있는지 확인하고
            const query1 = "SELECT COUNT(*) AS COUNT FROM WISHLIST_TB WHERE PRODUCT_FK = ? AND USER_FK = ?;";
            const query2 = "INSERT INTO WISHLIST_TB(PRODUCT_FK, USER_FK) VALUES(?, ?);";
            const query3 = "UPDATE PRODUCT_TB SET WISHLIST_CNT = WISHLIST_CNT + 1 WHERE PRODUCT_PK = ?;";
            

            const[rows, fields] = await conn.query(query1, [product.productId, userId]);
            const {COUNT : count} = rows[0];
            console.log(count);
            if(count === 0)//위시리시트에 존재하지 않는다면
            {
                await conn.query(query2, [product.productId, userId]);
                await conn.query(query3, [product.productId]);
            }
            //존재하면 아무것도 안해
            
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

    static async delWishList(userId, product){
        let conn;
        try{
            conn = await maria.getConnection();
            await conn.beginTransaction();

            //위시리스트에 있는지 확인하고
            const query1 = "SELECT * FROM WISHLIST_TB WHERE PRODUCT_FK = ? AND USER_FK = ?;";
            //있으면 삭제
            const query2 = "DELETE FROM WISHLIST_TB WHERE PRODUCT_FK = ? AND USER_FK = ?;";
            //없으면 삭제 X
            
            const [rows,  fields] = await conn.query(query1, [product.productId, userId]);
            
            if(rows){
                await conn.query(query2, [product.productId, userId]);
            }
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

    /**
     * token의 사용자에게 body의 상품을 사용자의 Cart에 추가
     * @param {string} userId - 사용자 id
     * @param {string} product - 상품 key값
     * @returns {[any]} - success : 수행 성공여부 msg : 세부
     */
    static async addCart(userId, product){
        let conn;
        try{
            conn = await maria.getConnection();
            await conn.beginTransaction();

            //카트에 있는지 확인
            const query1 = "SELECT COUNT(*) AS COUNT FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
            //카트에 없다면 추가
            const query2 = "INSERT INTO CART_TB(USER_FK, PRODUCT_FK, QUANTITY ) VALUES(?, ?, ?)"; 
            //카트에 있다면 수정
            const query3 = "UPDATE CART_TB SET QUANTITY = ? WHERE USER_FK = ? AND PRODUCT_FK = ?;";
            
            [rows, fields] = await conn.query(query1, [userId, product.productId]);
            
            const {COUNT : count} = rows[0];
            if(count === 0){
                await conn.query(query2, [userId, product.productId, product.quantity]);
            }else{
                await conn.query(query3, [product.quantity, userId, product.productId]);
            }
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

    static async delCart(userId, product){
        // const query = "DELETE FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
        // try{
        //     await queryExe(query, [userId, product.productId]);
        //     return {success : true};
        // }
        // catch(error){
        //     return { success : false, msg : error } ;
        // }

        let conn;
        try{
            conn = await maria.getConnection();
            await conn.beginTransaction();

            //카트에 있는지 확인
            const query1 = "SELECT COUNT(*) AS COUNT FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
            //카트에 없다면 추가
            const query2 = "DELETE FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;";
            
            //카트에 있는지 확인
            [rows, fields] = await conn.query(query1, [userId, product.productId]);
            
            const {COUNT : count} = rows[0];

            //카트에 없다면 추가
            if(count !== 0 ){
                await conn.query(query2, [userId, product.productId]);
            }
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

    static async addCartCount(userId, product){
        const query = "UPDATE CART_TB SET QUANTITY = ? WHERE USER_FK = ? AND PRODUCT_FK = ?;";
        try{
            await queryExe(query, [product.quantity, userId, product.productId ]);
            return {success : true};
        }
        catch(error){
            return { success : false, msg : error } ;
        }
    }

    static async getProductRand(){
        const productCnt = 3;
        // 신상품 개수 확인
        const query = "SELECT P.PRODUCT_PK, PI.IMG_DATA FROM PRODUCT_TB P JOIN PRODUCT_IMG_TB PI ON P.PRODUCT_PK = PI.PRODUCT_FK GROUP BY rand(PRODUCT_PK) Limit ?;";
    
        try{
            [rows, fields] = await queryExe(query, [productCnt]);

            return { success : true, data : rows };
        }
        catch(error){
            return { success : false, msg : error } ;
        }
    }
   
}

module.exports = ProductStorage;