import orderSummary from "../odbc/orderSummary.js";
import updateCustomerFedId from "./updateCustomerFedId.js";
import updatePlantPartTariffCountryOrigin from "./updateTariffCountryOriginCode.js";

export default async function updateModifiedBOL(BOLobj) {

    const BOLnumber = BOLobj["BOL"];
    const BOLAS400List = await orderSummary([BOLnumber]);
    const BOLAS400 = BOLAS400List[0];
    if(BOLobj['Fed ID'] !== BOLAS400["header"]["LINECONSIGNEEUSTAXID"]) {
        console.log("I update customer id");
        const result = await updateCustomerFedId(BOLobj['Customer Code'], BOLobj['Fed ID']);
    }

    for (let i = 0; i < BOLAS400.items.length; i++) {
        const item = BOLAS400.items[i];
        const newItem = BOLobj["Items"][i];
        if(newItem != undefined) {
            if(item["COUNTRYORIGIN"] !== newItem["CountryOrgin"] || item["TARIFF1NUMBER"] !== newItem["tariff code"]) {
                console.log("I update item")
                const result = await updatePlantPartTariffCountryOrigin(newItem["Part Number"], newItem["tariff code"], newItem["CountryOrgin"])
            }
        }
        console.log(item);
        console.log(newItem);
    }



    // console.log(BOLobj);
    // console.log(BOLAS400);
}