import client from "./databases/webservices.js";

const neededHeaderElements = [
    "OrderNumber",
    "ShipToName",
    "ShipToAddress1",
    "ShipToAddress2",
    "ShipToCity",
    "ShipToProvinceCode",
    "ShipToCountryCode",
    "ShipToPostalCode",
]

const neededItemElements = [
    "PartNumber",
    "QuantityOrdered",
    "OrderUnit",
    "UnitPrice"
]

export default async function orderSummary(number) {
    const args = getArgs(number);
    const data = await getOrderData(args);
    if(!data.error) {
        const summaryObj = getSummaryObj(data);
        return summaryObj;
    }
    else {
        return {
            error: "There was an error"
        };
    }
}

function getSummaryObj(data) {
    const headerObj = data.header.CMS_ServiceResponse_InquireSalesOrderHeader;
    const itemsObj = data.items.CMS_ServiceResponse_InquireSalesOrderItem;
    const header = getHeaderObj(headerObj);
    const items = getItemObj(itemsObj);
    return {
        header: header,
        items: items
    }
}

function getHeaderObj(headerObj) {
    const header = {};
    for (let i = 0; i < neededHeaderElements.length; i++) {
        const element = neededHeaderElements[i];
        header[element] = headerObj[element];
    }
    return header;
}

function getItemObj(itemObj) {
    const items = [];
    const orderItems = itemObj.Items.Item;
    for (let i = 0; i < orderItems.length; i++) {
        const item = {};
        for (let j = 0; j < neededItemElements.length; j++) {
            const element = neededItemElements[j];
            item[element] = orderItems[i][element];
        }
        items.push(item);
    }
    return items;
}

function getArgs(number) {
    const args = {
        "RequestID": "OrderSummary",
        "CMSDataBase": "ROYCEAYR",
        "ServPlntCod": "DFT",
        "OrderNumber": number
    };
    return args;
}

async function getOrderData(args) {
    try {
        const headerData = await webServiceRequest(args, "InquireSalesOrderHeader");
        const itemData = await webServiceRequest(args, "InquireSalesOrderItem");
        return {
            header: headerData,
            items: itemData
        }
    }
    catch(err) {
        return {
            error: err,
        }
    }
}

function webServiceRequest(args, serviceName) {
    let webServiceArgs = {};
    webServiceArgs["Service_" + serviceName] = args;
    return new Promise((resolve, reject) => {
        client[serviceName](webServiceArgs, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}

//- test

function assertEquals(expected, result) {
    if(expected == result) {
        console.log("Test Passed");
    }
    else {
        console.log("Test Failed, expected")
        console.log(expected);
        console.log("Got");
        console.log(result);
    }
}

function test_getArgs() {
    const args = {
        "RequestID": "OrderSummary",
        "CMSDataBase": "ROYCEAYR",
        "ServPlntCod": "DFT",
        "OrderNumber": "1120161"
    };
    assertEquals(args["RequestID"], getArgs("1120161")["RequestID"]);
    assertEquals(args["CMSDataBase"], getArgs("1120161")["CMSDataBase"]);
    assertEquals(args["ServPlntCod"], getArgs("1120161")["ServPlntCod"]);
    assertEquals(args["OrderNumber"], getArgs("1120161")["OrderNumber"]);
}

async function test_webServiceRequest() {

    const args = {
        "RequestID": "OrderSummary",
        "CMSDataBase": "ROYCEAYR",
        "ServPlntCod": "DFT",
        "OrderNumber": "1120291"
    };

    const test = await webServiceRequest(args, "InquireSalesOrderHeader");
    const test2 = await webServiceRequest(args, "InquireSalesOrderItem");

    console.log(JSON.stringify(test));
    console.log(JSON.stringify(test2));

    // assertEquals("1120161", test.CMS_ServiceResponse_InquireSalesOrderHeader.OrderNumber);
    // assertEquals("05447", test.CMS_ServiceResponse_InquireSalesOrderHeader.ShipToCustomer);

    // assertEquals("CLD-21-14-CUT", test2.CMS_ServiceResponse_InquireSalesOrderItem.Items.Item[1].PartNumber);
    // assertEquals("SHARPEN", test2.CMS_ServiceResponse_InquireSalesOrderItem.Items.Item[0].PartNumber);

}

// test_webServiceRequest()