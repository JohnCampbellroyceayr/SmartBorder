import orderSummary from "./src/odbc/orderSummary.js";
import getOrderItemLine from "./src/odbc/getOrderItemLine.js";
import findCustomer from "./src/odbc/getCustomer.js";
import getTariff from "./src/odbc/getTariff.js";
import updateModifiedBOL from "./src/webservices/updateModifiedBOL.js";

import express from "express";

const app = express();
app.use(express.json());

app.get('/api/order/:id', async (req, res) => {
    
    try {
        // console.time();
        const orderNumber = req.params.id;
        const order = await orderSummary([orderNumber]);
        if(order.length > 0) {
            res.json({
                ...order[0],
                FOUND: true
            });
        }
        else {
            res.json({
                FOUND: false
            })
        }
        // console.timeEnd();
    }
    catch(error) {
        res.json(null);
    }    
});

app.post('/api/getOrderArr', async (req, res) => {
    
    const orderArr = req.body.orderArr;
    console.time();
    const orders = await orderSummary(orderArr);
    console.timeEnd();
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

app.post('/api/updateAS400ToModifiedBOL', async (req, res) => {
    
    try {
        const result = await updateModifiedBOL(req.body);

        // const result = await updateCustomerFedId(customerNumber, newTaxId);
        // const result = await updateGlobalPartTariff(partNumber, tariffCode);
        // const result = await updatePlantPartCountry(partNumber, countryOfOrigin);

        // if(result.CMS_ServiceResponse.RequestStatus == 'OK') {
        //     res.json({
        //         error: false
        //     });
        // }
        res.json({
            error: true
        });
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

app.post('/api/getItemLine', async (req, res) => {
    
    try {
        const order = req.body.orderNumber;
        const item = req.body.itemNumber;
        const result = await getOrderItemLine(order, item);
        res.json(result);
    }
    catch(error) {
        res.json({error: true})
    }

});

app.listen(2004, () => {
    console.log('Server is running on port 2004');
});


// const result = await updateCustomerFedId("AA0001", "41-2069146");
// console.log(result);

// const result2 = await updateGlobalPartTariff("510-74356.L", "8207.90.30.80");
// console.log(result2);