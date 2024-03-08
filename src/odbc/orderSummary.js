import headerSummary from "./getHeader.js";
import itemsSummary from "./getItems.js";

export default async function orderSummary(bolNumbersArray) {
    try {
        console.time();
        bolNumbersArray = cleanArray(bolNumbersArray);
        const headers = await headerSummary(bolNumbersArray);
        console.timeEnd();
        const items = await itemsSummary(bolNumbersArray);
        const headerItems = joinHeaderItems(headers, items);
        return sortHeaderItemsToOrginalOrder(headerItems, bolNumbersArray);
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
        const bolNumber = inputArray[i];
        if(/^\d+$/.test(bolNumber) && bolNumber != '') {
            cleanArr.push(bolNumber);
        }
    }
    return cleanArr;
}

function joinHeaderItems(headerArr, itemsArr) {
    const headerItemArr = [];
    for (let i = 0; i < headerArr.length; i++) {
        const header = headerArr[i];
        const items = findItems(header.BOLNUMBER, itemsArr);
        headerItemArr.push({
            header: header,
            items: items
        });
    }
    return headerItemArr;
}

function findItems(bolNumber, itemsArr) {
    const orderItems = [];
    for (let i = 0; i < itemsArr.length; i++) {
        const item = itemsArr[i];
        if(item.BOLNUMBER == bolNumber) {
            let itemNumberAlreadySelected = false;
            for (let j = 0; j < orderItems.length; j++) {
                if(orderItems[j].ITEMNUMBER == item.ITEMNUMBER) {
                    itemNumberAlreadySelected = true;
                    break;
                }
            }
            if(itemNumberAlreadySelected == false) {
                orderItems.push(item);
            }
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
            if(headerItemObj.header.BOLNUMBER == order) {
                headerItemsOrgOrder.push(headerItemObj);
                break;
            }
        }
    }
    return headerItemsOrgOrder;
}