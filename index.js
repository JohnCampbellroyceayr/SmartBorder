import orderSummary from "./src/odbc/orderSummary.js";
import updateCustomerFedId from "./src/webservices/updateCustomerFedId.js";
import updateGlobalPartTariff from "./src/webservices/updateTariffCode.js";

import express from "express";

const app = express();
app.use(express.json());

app.get('/api/order/:id', async (req, res) => {
    
    const orderNumber = req.params.id;
    const order = await orderSummary([orderNumber]);
    res.json(order);

});

app.post('/api/getOrderArr', async (req, res) => {
    console.log(req.body);
    const orderArr = req.body.orderArr;
    console.log(orderArr);
    const orders = await orderSummary(orderArr);
    console.log(orders);
    res.json(orders);

});


app.post('/api/updateCustomerFedId', async (req, res) => {
    
    try {
        const customerNumber = req.body.customer;
        const newTaxId = req.body.taxId;
        console.log(customerNumber);
        console.log(newTaxId);
        const result = await updateCustomerFedId(customerNumber, newTaxId);
        console.log(result);
        res.json(result);
    }
    catch(error) {

        console.log(error);
        res.json({
            error: true
        });
    }

});

app.post('/api/updatePartTariffCode', async (req, res) => {
    
    try {
        const partNumber = req.body.part;
        const tariffCode = req.body.tariff;
        const result2 = await updateGlobalPartTariff(partNumber, tariffCode);
        console.log(result2);
        res.json(result2);
    }
    catch(error) {

        console.log(error);
        res.json({
            error: true
        });
    }

});

app.listen(2004, () => {
    console.log('Server is running on port 2004');
});

// const result = await updateCustomerFedId("AA0001", "41-2069146");
// console.log(result);

// const result2 = await updateGlobalPartTariff("510-74356.L", "8207.90.30.80");
// console.log(result2);