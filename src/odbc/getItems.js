import ODBC from "../databases/odbc.js";


export default async function itemsSummary(orderNumbersArray) {
    const orderNumbersSqlStr = orderNumbersArray.join(", ");
    const itemsSql = `
        SELECT 
            TRIM(FGORD#) AS OrderNumber,
            TRIM(STKMM.AVHARM) AS Tariff1Number,
            TRIM(STKMM.AVMFCOR) AS CountryOrigin,
            TRIM(FGPART) AS PartNumber,
            TRIM(FGQSHP) AS Quantity,
            TRIM(OCRI.DDUNIT) AS QuantityUOM,
            TRIM(OCRI.DDUNPR) AS UnitPrice,
            TRIM(STKMM.AVDES1) AS Description1,
            TRIM(STKMM.AVDES2) AS Description2,
            TRIM(STKMM.AVDES3) AS Description3
                    
        FROM BOLD

        LEFT JOIN STKMM
            ON TRIM(BOLD.FGPART) = TRIM(STKMM.AVPART)
        LEFT JOIN OCRI
            ON TRIM(BOLD.FGORD#) = TRIM(OCRI.DDORD#) AND TRIM(BOLD.FGITEM) = TRIM(OCRI.DDITM#)

        WHERE TRIM(FGORD#) IN (${orderNumbersSqlStr})

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