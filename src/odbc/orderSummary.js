import headerSummary from "./getHeader.js";
import itemsSummary from "./getItems.js";

export default async function orderSummary(orderNumbersArray) {
    try {
        orderNumbersArray = cleanArray(orderNumbersArray);
        const headers = await headerSummary(orderNumbersArray);
        const items = await itemsSummary(orderNumbersArray);
        const headerItems = joinHeaderItems(headers, items);
        return sortHeaderItemsToOrginalOrder(headerItems, orderNumbersArray);
    }
    catch(error) {
        return {
            error: error
        }
    }
}

function cleanArray(inputArray) {
    const cleanArr = [];
    for (let i = 0; i < inputArray.length; i++) {
        const orderNumber = inputArray[i];
        if(/^\d+$/.test(orderNumber) && orderNumber != '') {
            cleanArr.push(orderNumber);
        }
    }
    return cleanArr;
}

function joinHeaderItems(headerArr, itemsArr) {
    const headerItemArr = [];
    for (let i = 0; i < headerArr.length; i++) {
        const header = headerArr[i];
        const items = findItems(header.ORDERNUMBER, itemsArr);
        headerItemArr.push({
            header: header,
            items: items
        });
    }
    return headerItemArr;
}

function findItems(orderNumber, itemsArr) {
    const orderItems = [];
    for (let i = 0; i < itemsArr.length; i++) {
        const item = itemsArr[i];
        if(item.ORDERNUMBER == orderNumber) {
            orderItems.push(item);
        }
    }
    return orderItems;
}

function sortHeaderItemsToOrginalOrder(headerItemsArr, orderArr) {
    const headerItemsOrgOrder = [];
    for (let i = 0; i < orderArr.length; i++) {
        const order = orderArr[i];
        for (let j = 0; j < headerItemsArr.length; j++) {
            const headerItemObj = headerItemsArr[j];
            if(headerItemObj.header.ORDERNUMBER == order) {
                headerItemsOrgOrder.push(headerItemObj);
                break;
            }
        }
    }
    return headerItemsOrgOrder;
}