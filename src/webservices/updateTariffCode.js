import { partClient } from "../databases/webservices.js";

export default async function UpdatePlantPartTariff(partNumber, newTariffCode, countryOrigin, provOrigin) {

    return new Promise(async (resolve, reject) => {
        
        const argsCountryOriginUpdate = {
            "Service_UpdatePlantPart": {
                "RequestID": "UpdatePart1",
                "CMSDataBase": "ROYCEAYR",
                "ServPlntCod": "DFT",
                "InternalPartNumber": partNumber,
                "CountryOfOrigin": countryOrigin,
                "ProvinceOfOrigin": provOrigin,
                "PlantCode": "DFT"
            }
         };



         partClient.UpdatePlantPart(argsCountryOriginUpdate, function(err, result) {
            if (err) {
                console.log("Error");
                console.error(err.response.config.data);
                console.error("-----------------------");
                reject(err.body);
            } else {
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
                        "ManufacturerProvinceOfOrigin": provOrigin,
                    }
                };
                partClient.UpdateGlobalPart(argsHarmiCodeUpdate, function(err, result2) {
                    if (err) {
                        console.log("Error");
                        console.error(err.response.config.data);
                        console.error("-----------------------");
                        reject(err.body);
                    } else {
                        resolve(result2);
                    }
                });     
            }
        });
    });
    
}