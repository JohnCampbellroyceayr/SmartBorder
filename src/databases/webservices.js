import soap from 'soap';

const wsdlUrlCustomer = 'http://192.168.0.200:8080/iVPWebServices/services/ivpwsMAIN001?wsdl';
const wsdlUrlPart = 'http://192.168.0.200:8080/iVPWebServices/services/ivpwsIV001?wsdl';

const username = 'JCAMP';
const password = 'JCAMP';

function createConnection(wsdlUrl) {
    return new Promise((resolve) => {
        soap.createClient(wsdlUrl, function(err, client) {
            if (err) {
                console.error(err);
            } else {
                var wsSecurity = new soap.WSSecurity(username, password);
                client.setSecurity(wsSecurity);
                console.log("Connected To web services");
                resolve(client);
            }
        });
    })
}

export const customerClient = await createConnection(wsdlUrlCustomer);
export const partClient = await createConnection(wsdlUrlPart);

