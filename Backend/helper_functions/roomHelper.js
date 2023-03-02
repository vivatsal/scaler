function addRoomArray(roomType, number, normal, deluxe, premium) {

    if (roomType=="normal") {
        normal.push(number)
    }

    if (roomType=="premium") {
        premium.push(number)
    }

    if (roomType=="deluxe") {
        deluxe.push(number)
    }

}

function discardRoomArray(roomType, number, normalEx, deluxeEx, premiumEx) {

    if (roomType=="normal") {
        normalEx.push(number)
    }

    if (roomType=="premium") {
        premiumEx.push(number)
    }

    if (roomType=="deluxe") {
        deluxeEx.push(number)
    }

}

function selectRoom(normal, deluxe, premium, roomType) {

    let roomNumber; 

    if (roomType=="normal") {
        if(normal.length==0) {
            return -1;
        }
        roomNumber = normal[0];
    }

    else if (roomType=="premium") {
        if(premium.length==0) {
            return -1;
        }
        roomNumber = premium[0];
    }

    else if (roomType=="deluxe") {
        if(deluxe.length==0) {
            return -1;
        }
        roomNumber = deluxe[0];
    }

    return roomNumber;

}

module.exports = {addRoomArray, discardRoomArray, selectRoom}