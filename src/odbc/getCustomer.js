import ODBC from "../databases/odbc.js";

export default async function findCustomer(customerNumber) {

    const headerSql = `

        SELECT 
            TRIM(BVNAME) AS Name,
            TRIM(BVADR1) AS Description1,
            TRIM(BVADR2) AS Description2,
            TRIM(BVADR3) AS Description3,
            TRIM(BVPSTL) AS FedId
        FROM CUST
        WHERE TRIM(BVCUST) = ?

    `;

    return new Promise(async (resolve, reject) => {
        ODBC.query(headerSql, [customerNumber.trim()], (error, result) => {
            if(error) {
                console.log(error);
                reject(null);
            }
            else {
                if(result.length == 0) {
                    reject(null);
                }
                else {
                    resolve(result[0]);
                }
            }
        });
    });

}