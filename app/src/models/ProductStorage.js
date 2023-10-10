//maria database require
const maria = require('../database/connect/maria');

class ProductStorage{
    static getProductInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM  PRODUCT_TB WHERE PRODUCT_PK = ?;";
            maria.query(query, [id], (err,data) =>{
                if(err) reject(`${err}`);
                resolve(data[0]);
            })
        })
    }

    static setProductInfo(prod){
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO PRODUCT_TB(CARTEGORY_FK, STOCK_AMT, PRICE, PRODUCT_NM, COLOR, `DESCRIBE`, `HASHTAG`) VALUES(?, ?, ?, ?, ?, ?, ?);"
            maria.query(query, [prod.category, prod.stock, prod.price, prod.name, prod.color, prod.describe, prod.hashtag]
                , (err) =>{
                if(err) reject(`${err}`);
                console.log('insert product! ');
                resolve({
                    success : true
                });
            });

            
        });

    }
    static searchProduct(searchKeyword){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM PRODUCT_TB WHERE PRODUCT_NM LIKE ? OR COLOR LIKE ? OR HASHTAG LIKE ?;";
            maria.query(query,[`%${searchKeyword}%`, `%${searchKeyword}%`, `%${searchKeyword}%`  ], (err, data) =>{
                if(err) reject(`${err}`);
                resolve(data);
            })
        })
    }
}

module.exports = ProductStorage;