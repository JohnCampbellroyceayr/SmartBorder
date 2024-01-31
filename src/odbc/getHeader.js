import ODBC from "../databases/odbc.js";

export default async function headerSummary(orderNumbersArray) {

    const orderNumbersSqlStr = orderNumbersArray.join(", ");
    const headerSql = `

        SELECT 
            TRIM(FEBOL#) AS OrderNumber,
            TRIM(FESNME) AS LineConsigneeName,
            TRIM(BOLH.FEBCS#) AS CustomerCode,
            TRIM(CUST.BVPSTL) AS LineConsigneeUSTaxID,
            TRIM(FESAD1) AS LineConsigneeAddress1,
            TRIM(FESCTY) AS LineConsigneeCity,
            TRIM(FESPOV) AS LineConsigneeState,
            TRIM(FESCRY) AS LineConsigneeCountry,
            TRIM(FESPTC) AS LineConsigneePostalCode

        FROM BOLH

        LEFT JOIN CUST
        ON TRIM(BOLH.FEBCS#) = TRIM(CUST.BVCUST)

        WHERE TRIM(FEBOL#) IN (${orderNumbersSqlStr})

    `;

    return new Promise(async (resolve, reject) => {
        ODBC.query(headerSql, (error, result) => {
            if(error) {
                console.log(error);
                reject(null);
            }
            else {
                resolve([...result]);
            }
        });
    });
}