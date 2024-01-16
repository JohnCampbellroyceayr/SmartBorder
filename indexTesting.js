import orderSummary from "./src/odbc/orderSummary.js";
// import updateCustomerFedId from "./src/webservices/updateCustomerFedId.js";
// import updateGlobalPartTariff from "./src/webservices/updateTariffCode.js";

const orders = [
    "1120789",
    "1120594"
]

const order = await orderSummary(orders);
console.log(order);

// const result = await updateCustomerFedId("AA0001", "41-2069146");
// console.log(result);

// const result2 = await updateGlobalPartTariff("510-74356.L", "8207.90.30.80");
// console.log(result2);