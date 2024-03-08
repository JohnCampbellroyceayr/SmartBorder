import { partClient } from "../databases/webservices.js";

export default async function updatePlantPartTariffCountryOrigin(partNumber, newTariffCode, countryOrigin) {

    return new Promise(async (resolve, reject) => {
        
        const argsHarmiCodeUpdate = {
            "Service_UpdateGlobalPart": {
                "RequestID": "UpdatePart2",
                "CMSDataBase": "ROYCEAYR",
                "ServPlntCod": "DFT",
                "ServLang": "ENU",
                "CustomizedLibrary": "ROYCEAYR",
                "InternalPartNumber": partNumber,
                "HarmonizationCode": newTariffCode,
                "ManufacturingCountryOfOrigin": countryOrigin,
            }
        };

        partClient.UpdateGlobalPart(argsHarmiCodeUpdate, function(err, result) {
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