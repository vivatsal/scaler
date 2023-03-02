const BookedRoom = require("../schema/BookedRooms")
const ReserveRoom = require("../schema/ReservedBooking")
const PreviousRooms = require("../schema/PreviouBookings")

async function updateDb() {

    const prevOrders = await BookedRoom.find({});

    prevOrders.map(async (docs)=>{
        
        //console.log(docs);

        const date = new Date()

        if (docs["endDateTime"].getTime()<date.getTime()) {
            console.log("Booking ended : ", docs["_id"])
            const newPrev = new PreviousRooms({
                email: docs["email"],
                number: docs["number"],
                roomType: docs["roomType"],
                status: 1,
                roomPrice: docs["roomPrice"],
                totalPrice: docs["totalPrice"],
                startDateTime: docs["startDateTime"],
                duration: docs["duration"],
                endDateTime: docs["endDateTime"],
                bookingTime: new Date()
            })
            await newPrev.save();
            await BookedRoom.deleteOne(docs);
        }

    })

    console.log("Database Updated")

}

async function pendingBookings() {

    const pending = await ReserveRoom.find({});
    
    pending.map(async (docs) => {
        const date = new Date();

        const transactionTime = (Math.abs(date - docs["bookingTime"]))/(1000*60)

        console.log(transactionTime)

        if (transactionTime>10) {
            await ReserveRoom.deleteOne(docs)
        }
    })

    console.log("Pending Transactions Cleared");

}

function maintainDb() {
    updateDb();
    pendingBookings();
}

module.exports = {maintainDb}