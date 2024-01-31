import ODBC from "../databases/odbc.js";

export default async function itemsSummary(orderNumbersArray) {
    return new Promise(async (resolve, reject) => {

        const itemsPromise = getItemsWithOutCountryCodes(orderNumbersArray);
        const countryCodesPromise = getCountryCodes();

        Promise.all([itemsPromise, countryCodesPromise])
        .then((results) => {
            const items = results[0];
            const countryCodes = results[1];
            resolve(matchCodesWithCountryOriginString(items, countryCodes));
        })
        .catch((error) => {
            reject(null);
        });
    });
}

function getItemsWithOutCountryCodes(orderNumbersArray) {
    const orderNumbersSqlStr = orderNumbersArray.join(", ");
    const itemsSql = `
    
        SELECT 
            TRIM(FGBOL#) AS OrderNumber,
            TRIM(BOLD.FGITEM) AS ItemNumber,
            COALESCE(TRIM(STKMM.AVHARM), TRIM(STKMP.AWHARM)) AS Tariff1Number,
            COALESCE(TRIM(STKMM.AVMFCOR), TRIM(STKMP.AWMFCOR)) AS CountryOriginString,
            COALESCE(TRIM(STKMM.AVMFPOR), TRIM(STKMP.AWMFPOR)) AS ProvOrigin,
            TRIM(FGPART) AS PartNumber,
            TRIM(FGQSHP) AS Quantity,
            TRIM(OCRI.DDUNIT) AS QuantityUOM,
            TRIM(OCRI.DDUNPR) AS UnitPrice,
            COALESCE(TRIM(STKMM.AVDES1), TRIM(STKMP.AWDES1)) AS Description1,
            COALESCE(TRIM(STKMM.AVDES2), TRIM(STKMP.AWDES2)) AS Description2,
            COALESCE(TRIM(STKMM.AVDES3), TRIM(STKMP.AWDES3)) AS Description3
        FROM BOLD

        LEFT JOIN STKMM ON TRIM(BOLD.FGPART) = TRIM(STKMM.AVPART)
        LEFT JOIN STKMP ON TRIM(BOLD.FGPART) = TRIM(STKMP.AWPART)
        LEFT JOIN OCRI ON TRIM(BOLD.FGORD#) = TRIM(OCRI.DDORD#) AND TRIM(BOLD.FGITEM) = TRIM(OCRI.DDITM#)
        
        WHERE TRIM(FGBOL#) IN (${orderNumbersSqlStr})

    `;
    return new Promise(async (resolve, reject) => {
        ODBC.query(itemsSql, (error, result) => {
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

function getCountryCodes() {
    const sql = `
        SELECT TRIM(P6COD) AS NAME, P6ISO2A AS CountryCode FROM CORG
    `;
    return new Promise(async (resolve, reject) => {
        ODBC.query(sql, (error, result) => {
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

function matchCodesWithCountryOriginString(items, countryCodes) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if(item.COUNTRYORIGINSTRING !== "") {
            for (let j = 0; j < countryCodes.length; j++) {
                const code = countryCodes[j];
                if(item.COUNTRYORIGINSTRING == code.NAME) {
                    items[i]["COUNTRYORIGIN"] = code["COUNTRYCODE"];
                }
            }
        }
    }
    return items;
}