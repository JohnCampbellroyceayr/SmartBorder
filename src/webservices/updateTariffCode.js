import { partClient } from "../databases/webservices.js";

export default async function updateGlobalPartTariff(partNumber, newTariffCode) {

    return new Promise(async (resolve, reject) => {
        
        const args = {
            "Service_UpdateGlobalPart": {
                "RequestID": "UpdatePart1",
                "CMSDataBase": "ROYCEAYR",
                "ServPlntCod": "DFT",
                "CustomizedLibrary": "ROYCEAYR",
                "InternalPartNumber": partNumber,
                "HarmonizationCode": newTariffCode,
                // "ManufacturingCountryOfOrigin": 
            }
         };

         partClient.UpdateGlobalPart(args, function(err, result) {
            if (err) {
                console.log("Error");
                console.error(err.response.config.data);
                console.error("-----------------------");
                reject(err.body);
            } else {
                resolve(result);
            }
        });
    });
    
}