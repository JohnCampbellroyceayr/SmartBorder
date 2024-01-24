import ODBC from "../databases/odbc.js";


export default function getTariff(partNumber) {
    return new Promise(async (resolve, reject) => {
        try {
            const manufacturedPart = await getTariffManufacturedPart(partNumber);
            resolve(manufacturedPart);
        }
        catch(error) {
            try {
                const purchasedPart = await getTariffPurchasedPart(partNumber);
                resolve(purchasedPart);
            }
            catch(error) {
                reject(null);
            }   
        }
    })    
}


function getTariffManufacturedPart(partNumber) {
    const selectPartSql = `
        SELECT

            TRIM(AVHARM) AS TariffNumber,
            TRIM(AVMFCOR) AS CountryOrigin,
            TRIM(AVMFPOR) AS ProvOrigin,
            TRIM(AVDES1) AS Description1,
            TRIM(AVDES2) AS Description2,
            TRIM(AVDES3) AS Description3
                    
        FROM STKMM

        WHERE TRIM(AVPART) = ?

    `;
    return new Promise(async (resolve, reject) => {
        ODBC.query(selectPartSql, [partNumber], (error, result) => {
            if(error) {
                console.log(error);
                reject(null);
            }
            else {
                if(result.length > 0) {
                    resolve(result[0]);
                }
                else {
                    reject(null);
                }
            }
        });
    });
}


function getTariffPurchasedPart(partNumber) {
    const selectPartSql = `
        SELECT

            TRIM(AWHARM) AS Tariff1Number,
            TRIM(AWMFCOR) AS CountryOrigin,
            TRIM(AWMFPOR) AS ProvOrigin,
            TRIM(AWDES1) AS Description1,
            TRIM(AWDES2) AS Description2,
            TRIM(AWDES3) AS Description3
                    
        FROM STKMP

        WHERE TRIM(AWPART) = ?

    `;
    return new Promise(async (resolve, reject) => {
        ODBC.query(selectPartSql, [partNumber], (error, result) => {
            if(error) {
                console.log(error);
                reject(null);
            }
            else {
                if(result.length > 0) {
                    resolve(result[0]);
                }
                else {
                    reject(null);
                }
            }
        });
    });
}


// console.log(await getTariff('SPRL-3/4F-SC-3'));
// console.log(await getTariff('R99-SER-R60-32326'));
// console.log(await getTariff('SPRL-3/4F-SC-3'));