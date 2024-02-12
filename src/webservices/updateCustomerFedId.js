import { customerClient } from "../databases/webservices.js";

export default async function updateCustomerFedId(customerNumber, newFedId) {

    return new Promise(async (resolve, reject) => {
        
        const args = {
            "Service_UpdateCustomer": {
                "RequestID": "UpdateCustomer1",
                "RequestMode": "TEST123assa",
                "CMSDataBase": "ROYCEAYR",
                "ServLang": "ENU",
                "ServPlntCod": "DFT",
                "CustomizedLibrary": "ROYCEAYR",
                "CustomerNbr": customerNumber,
                "GSTLicence": newFedId
            }
         };

        customerClient.UpdateCustomer(args, function(err, result) {
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