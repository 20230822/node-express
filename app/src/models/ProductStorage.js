//maria database require
const maria = require('../database/connect/maria');
//db query execute function
const queryExe = require('./common');

class ProductStorage{
    static async getProductInfo(id) {
        
        const query = "SELECT * FROM PRODUCT_TB AS P left join PRODUCT_IMG_TB AS I on P.PRODUCT_PK = I.PRODUCT_FK WHERE P.PRODUCT_PK = ?;";
        try{
            [rows, fields] =  await queryExe(query, [id]);
            if(rows)
            {
                return {success : true, data: rows};
            }
            return { success : true, msg : "일치하는 데이터가 없습니다." } ;
            
        }
        catch(error){
            throw error;
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
        
        //첫번째 쿼리로 해당 카테고리 상품 몇갠지 / listsize 으로 페이지 갯수
        let conn;
        try{
            conn = await maria.getConnection();
            await conn.beginTransaction();

            //해당 카테고리 상품 총갯수
            const query1 = "SELECT COUNT(*) AS COUNT FROM CART_TB WHERE USER_FK = ? AND PRODUCT_FK = ?;;";
            //해당 유저의 상품 카트 갯수 수정
            const query2 = "UPDATE CART_TB SET QUANTITY = ? WHERE USER_FK = ? AND PRODUCT_FK = ?;";
            
            const [rows, fields] = await conn.query(query1, [userId, product.productId ]);
            const {COUNT : count} = rows[0]; 
            console.log(count);
            if(count !== 0){//상품이 있다면
                await conn.query(query2, [product.quantity, userId, product.productId ]);
            }
            else{
                throw Error('존재 하지 않는 카트리스트입니다.')
            }

            await conn.commit();
            return {success : true,  msg : "트랜잭션 완료"}

        }catch(error){
            await conn.rollback();
            console.log(error);
            throw error;
        }finally{
            conn.release();
        }
    }

    static async getRandProduct(){
        const productCnt = 3;
        const query = "SELECT P.PRODUCT_PK, PI.IMG_DATA FROM PRODUCT_TB P JOIN PRODUCT_IMG_TB PI ON P.PRODUCT_PK = PI.PRODUCT_FK GROUP BY rand(PRODUCT_PK) Limit ?;";
    
        try{
            [rows, fields] = await queryExe(query, [productCnt]);

            return { success : true, data : rows };
        }
        catch(error){
            return { success : false, msg : error } ;
        }
    }

    static async getCategory(product){
        //상위 카테카테고리
        if(product.category % 10 === 0){
            const upperCategory = product.category / 10  //팬던트, 플로어 등 상위 카테고리 앞자리(십의 자리 번호)
            //첫번째 쿼리로 해당 카테고리 상품 몇갠지 / listsize 으로 페이지 갯수
            let conn;
            try{
                conn = await maria.getConnection();
                await conn.beginTransaction();
    
                //해당 카테고리 상품 총갯수
                const query1 = "SELECT COUNT(*) AS COUNT FROM PRODUCT_TB WHERE CARTEGORY_FK LIKE ?;";
                //해당카테고리 정보 페이징 해서 가져오기 limit offset
                const query2 = "SELECT P.PRODUCT_PK, P.CARTEGORY_FK, P.PRICE, (SELECT IMG_DATA FROM project.PRODUCT_IMG_TB WHERE PRODUCT_FK =" +
                     "P.PRODUCT_PK LIMIT 1 ) AS IMG_DATA FROM PRODUCT_TB P WHERE CARTEGORY_FK LIKE ? LIMIT ? OFFSET ?;";
                
                const [rows, fields] = await conn.query(query1, [`${upperCategory}_`]);
                
                let {COUNT : count} = rows[0]; //상품 갯수
    
                const pagesize =  Math.floor(count/product.pageListSize) + 1 ; //보고 싶은 만큼으로 나눠서 최대 페이지수
                
                const offset = (product.page -1) * pagesize;
    
                console.log("pagesize " + pagesize + " offset " + offset );
                const [rows2, fields2]  =  await conn.query(query2, [`${upperCategory}_`, product.pageListSize, offset]);
    
                await conn.commit();
                const response = {count: count ,products : rows2}
                return response;
    
            }catch(error){
                await conn.rollback();
                console.log(error);
                throw Error('트랜잭션 오류') ;
            }finally{
                conn.release();
            }
        }
        //세부 카테고리 라면
        if(product.category %10 !== 0){
            //첫번째 쿼리로 해당 카테고리 상품 몇갠지 / listsize 으로 페이지 갯수
            let conn;
            try{
                conn = await maria.getConnection();
                await conn.beginTransaction();
    
                //해당 카테고리 상품 총갯수
                const query1 = "SELECT COUNT(*) AS COUNT FROM PRODUCT_TB WHERE CARTEGORY_FK = ?;";
                //해당카테고리 정보 페이징 해서 가져오기 limit offset
                const query2 = "SELECT P.PRODUCT_PK, P.CARTEGORY_FK, P.PRICE, (SELECT IMG_DATA FROM project.PRODUCT_IMG_TB WHERE PRODUCT_FK =" +
                     "P.PRODUCT_PK LIMIT 1 ) AS IMG_DATA FROM PRODUCT_TB P WHERE CARTEGORY_FK = ? LIMIT ? OFFSET ?;";

                const [rows, fields] = await conn.query(query1, [product.category]);
                
                let {COUNT : count} = rows[0]; //상품 갯수
    
                const pagesize =  Math.floor(count/product.pageListSize) + 1 ; //보고 싶은 만큼으로 나눠서 최대 페이지수
                
                const offset = (product.page -1) * pagesize;
    
                console.log("pagesize " + pagesize + " offset " + offset );
                const [rows2, fields2]  =  await conn.query(query2, [product.category, product.pageListSize, offset]);
    
                await conn.commit();
                const response = {count : count, products : rows2}
                return response;
    
            }catch(error){
                await conn.rollback();
                console.log(error);
                throw Error('트랜잭션 오류') ;
            }finally{
                conn.release();
            }
        }

        
    }
    
    static async getHashtagProduct(client){
        const productCnt = 5;
        const query = "( SELECT P.PRODUCT_PK, PI.IMG_DATA FROM PRODUCT_TB P JOIN PRODUCT_IMG_TB PI ON P.PRODUCT_PK = PI.PRODUCT_FK WHERE HASHTAG REGEXP ? GROUP BY P.PRODUCT_PK LIMIT ?) "
          + "UNION ( SELECT P.PRODUCT_PK, PI.IMG_DATA FROM PRODUCT_TB P JOIN PRODUCT_IMG_TB PI ON P.PRODUCT_PK = PI.PRODUCT_FK WHERE HASHTAG REGEXP ? GROUP BY P.PRODUCT_PK LIMIT ?) "
          + "UNION ( SELECT P.PRODUCT_PK, PI.IMG_DATA FROM PRODUCT_TB P JOIN PRODUCT_IMG_TB PI ON P.PRODUCT_PK = PI.PRODUCT_FK WHERE HASHTAG REGEXP ? GROUP BY P.PRODUCT_PK LIMIT ?);";
    
        try{
            [rows, fields] = await queryExe(query, [client.hashtag1, productCnt, client.hashtag2, productCnt, client.hashtag, productCnt]);
            console.log(rows);
            return { success : true, data : rows };
        }
        catch(error){
            return { success : false, msg : error } ;
        }
    }
   
}

module.exports = ProductStorage;