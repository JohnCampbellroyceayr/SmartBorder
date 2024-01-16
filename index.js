import orderSummary from "./src/getOrderSummary.js";

import express from "express";

const app = express();

function objectIntoExcelHeader(obj) {
    let str = obj.header.ShipToName;
    str += "|" + obj.header.ShipToAddress2;
    str += "|" + obj.header.ShipToAddress1;
    str += "|" + obj.header.ShipToCity;
    str += "|" + obj.header.ShipToProvinceCode;
    str += "|" + obj.header.ShipToCountryCode;
    str += "|" + obj.header.ShipToPostalCode;
    return str;
}

function objectIntoExcelItems(obj) {
    let str = '';
    for (let i = 0; i < obj.items.length; i++) {
        const item = obj.items[i];
        str += item.PartNumber;
        str += "|" + item.QuantityOrdered;
        str += "|" + item.OrderUnit;
        str += "|" + item.UnitPrice;
        str += '\n';
    }
    return str;
}

// const order = await orderSummary("1120161");
// console.log(order);
// console.log(objectIntoExcelHeader(order));
// console.log(objectIntoExcelItems(order));

app.get('/api/:id', async (req, res) => {
    
    const orderNumber = req.params.id;
    const order = await orderSummary(orderNumber);
    console.log(order);
    res.json(order);
});

app.listen(2004, () => {
    console.log('Server is running on port 2004');
});