import orderSummary from "./src/odbc/orderSummary.js";
import updateCustomerFedId from "./src/webservices/updateCustomerFedId.js";
import updateGlobalPartTariff from "./src/webservices/updateTariffCode.js";
import findCustomer from "./src/odbc/getCustomer.js";
import getTariff from "./src/odbc/getTariff.js";

import express from "express";
import fs from 'fs';

const app = express();
app.use(express.json());

app.get('/api/order/:id', async (req, res) => {
    
    const orderNumber = req.params.id;
    const order = await orderSummary([orderNumber]);
    res.json(order);

});

app.post('/api/getOrderArr', async (req, res) => {

    const orderArr = req.body.orderArr;
    const orders = await orderSummary(orderArr);
    fs.writeFileSync("./output.txt", JSON.stringify(orders, null, 2));
    res.json(orders);

});

app.get('/api/getCustomer/:customerNumber', async (req, res) => {

    try {
        const customerNumber = req.params.customerNumber;
        const customer = await findCustomer(customerNumber);
        res.json(customer);
    }
    catch(error) {
        res.json({
            NAME: "",
            DESCRIPTION1: "",
            DESCRIPTION2: "",
            DESCRIPTION3: "",
            FEDID: ""
        })
    }

});

app.post('/api/updateCustomerFedId', async (req, res) => {
    
    try {
        const customerNumber = req.body.customer;
        const newTaxId = req.body.taxId;
        const result = await updateCustomerFedId(customerNumber, newTaxId);
        if(result.CMS_ServiceResponse.RequestStatus == 'OK') {
            res.json({
                error: false
            });
        }
    }
    catch(error) {
        console.log(error);
        res.json({
            error: true
        });
    }

});

app.post('/api/getTariff', async (req, res) => {

    try {
        const partNumber = req.body.partNumber;
        const part = await getTariff(partNumber);
        res.json(part);
    }
    catch(error) {
        res.json({
            TARIFFNUMBER: "",
            COUNTRYORIGIN: "",
            DESCRIPTION1: "",
            DESCRIPTION2: "",
            DESCRIPTION3: "",
        })
    }

});

app.post('/api/updatePartTariffCode', async (req, res) => {
    
    try {
        const partNumber = req.body.part;
        const tariffCode = req.body.tariff;
        const countryOrigin = req.body.countryOfOrigin;
        const provOrigin = req.body.provOfOrigin;
        const result = await updateGlobalPartTariff(partNumber, tariffCode, countryOrigin, provOrigin);
        if(result.CMS_ServiceResponse.RequestStatus == 'OK') {
            res.json({
                error: false
            });
            return ;
        }
    }
    catch(error) {
        console.log(error);
    }

    res.json({
        error: true
    });

});

app.listen(2004, () => {
    console.log('Server is running on port 2004');
});


// const result = await updateCustomerFedId("AA0001", "41-2069146");
// console.log(result);

// const result2 = await updateGlobalPartTariff("510-74356.L", "8207.90.30.80");
// console.log(result2);