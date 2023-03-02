const router = require("express").Router();
const Room = require("../schema/Rooms");
const BookedRoom = require("../schema/BookedRooms")
const ReserveRoom = require("../schema/ReservedBooking")
const {maintainDb} = require("../helper_functions/dbHelper")
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Category = require("../schema/Category");
const {addRoomArray, discardRoomArray, selectRoom} = require("../helper_functions/roomHelper")
const {priceObj} = require("../priceObject")

dotenv.config();

mongoose.connect(process.env.mongoUrl).then(()=>{console.log("Connected to database : Router Module")}).catch((err)=>{console.log(err)})

maintainDb();

router.post("/add", async(req, res)=>{

    let type = req.body.type;

    type = type.toString().toLowerCase();

    const roomType = type;

    let totalRooms = await Category.find({});

    totalRooms = totalRooms[0][type];

    let roomNumber = type.toUpperCase().slice(0, 1) + (totalRooms+1);

    console.log(roomNumber);

    const room = new Room({
        number: roomNumber,
        price: req.body.price,
        roomType: roomType
    })

    const details = await room.save();

    console.log(details);

    countRooms();

    res.send("Ok")

})

const countRooms = async() => {

    let idObj;

    idObj = await Category.find({})

    let id = idObj[0]["_id"]

    let normalCount = await Room.find({"roomType": "normal"});
    let deluxeCount = await Room.find({"roomType": "deluxe"});
    let premiumCount = await Room.find({"roomType": "premium"});

    normalCount = normalCount.length;
    deluxeCount = deluxeCount.length;
    premiumCount = premiumCount.length;

    await Category.findOneAndUpdate({"_id": id}, {$set : {"normal": normalCount, "deluxe": deluxeCount, "premium": premiumCount}})

}

router.post("/bookrooms", async(req, res) => {
    const newRoom = new BookedRoom({
        email: "rshubham034@gmail.com",
        number: "N2",
        roomType: "normal",
        status: 1,
        roomPrice: 2000,
        totalPrice: 6000,
        startDateTime: new Date("Feb 22, 2023 06:00:00"),
        duration: 3,
        endDateTime: new Date("Feb 22, 2023 9:00:00"),
        bookingTime: new Date()
    })
    await newRoom.save();
    res.send("ok")
})

router.post("/book", async(req, res) => {

    // const email = "rshubham034@gmail.com"
    // const date = "2023-02-22";
    // const time = "10:00:00";
    // const duration = 7;
    // const roomType = "normal";

    const email = req.body.email;
    const date = req.body.date;
    const time = req.body.time;
    const duration = req.body.duration;
    const roomType = req.body.roomType;

    // const priceObj = {"normal": 2000, "deluxe": 4000, "premium": 4000}

    const dateTime = date + " " + time;

    const startTs = new Date(dateTime)
    const startFinal = new Date(dateTime)

    //console.log(startTs)

    const startMili = startTs.getTime();
    const endTs = new Date(startTs.setHours(startTs.getHours() + duration))
    const endMili = endTs.getTime()
    //console.log(startMili, " ", endMili)

    let normal = [];
    let deluxe = [];
    let premium = [];
    const normalEx = [];
    const deluxeEx = [];
    const premiumEx = [];

    const availRooms = await BookedRoom.find({roomType: `${roomType}`})

    availRooms.map((doc) => {
        console.log(doc)

        let status = doc["status"]
        let bStart = doc["startDateTime"];
        let bEnd = doc["endDateTime"];

        const bStartMili = bStart.getTime();
        const bEndMili = bEnd.getTime();

        //console.log(bStart, " ", bEnd, " to book from ", startFinal, " ", endTs)
        // console.log(bStartMili, " ", bEndMili, " to book from ", startMili, " ", endMili)

        if ((bEndMili<startMili || endMili<bStartMili) & status==1) {
            addRoomArray(roomType, doc["number"], normal, deluxe, premium)
            // console.log(normal, " ", deluxe, " ", premium)
        }

        else {
            discardRoomArray(roomType, doc["number"], normalEx, deluxeEx, premiumEx)
            // console.log(normalEx, " ", deluxeEx, " ", premiumEx)
        }

    })

    // console.log(normal, " ", deluxe, " ", premium)
    // console.log(normalEx, " ", deluxeEx, " ", premiumEx)

    normal = normal.filter((x) => !normalEx.includes(x))
    deluxe = deluxe.filter((x) => !deluxeEx.includes(x))
    premium = premium.filter((x) => !premiumEx.includes(x))

    // console.log(normal, " ", deluxe, " ", premium)
    // console.log(normalEx, " ", deluxeEx, " ", premiumEx)

    roomNumber = selectRoom(normal, deluxe, premium, roomType)

    console.log(roomNumber)

    if (roomNumber!="-1") {

        const p = Number(priceObj[roomType])
        const tp = Number(p*duration)
        
        const newBooking = new ReserveRoom({
            email: email,
            number: roomNumber,
            roomType: roomType,
            status: 1,
            roomPrice: p,
            totalPrice: tp,
            startDateTime: startFinal,
            duration: duration,
            endDateTime: endTs,
            bookingTime: new Date()
        })

        const booking = await newBooking.save();
        const transactionId = booking["_id"]
        console.log(booking, " ", transactionId)

    }

    res.send("ok")

}) 

router.post("/confirmbooking", async(req, res)=>{

    const email = req.body.email;
    //console.log(email)
    const user = await ReserveRoom.find({email: email})
    //console.log(user)
    const price = Number(user[0]["totalPrice"]) + Number(user[0]["tip"])
    console.log(price)
    res.send("ok")

})

router.post("/booked", async(req, res)=>{

    const email = req.body.email;
    console.log(email)
    let user = await ReserveRoom.find({email: `${email}`})

    user = user[0];

    const bookedRoom = new BookedRoom({
        email: user["email"],
        number: user["number"],
        roomType: user["roomType"],
        status: 1,
        roomPrice: user["roomPrice"],
        totalPrice: user["totalPrice"],
        startDateTime: user["startDateTime"],
        duration: user["duration"],
        endDateTime: user["endDateTime"],
        bookingTime: new Date()
    })

    const details = await bookedRoom.save();
    await ReserveRoom.findByIdAndDelete(user["_id"])
    console.log(details)
    res.send("ok")

})

router.post("/bookingsemail", async(req, res)=> {
    
    const email = req.body.email;
    const bookings = await BookedRoom.find({email: `${email}`})
    console.log(bookings)

})

router.post("/bookingsroom", async(req, res)=>{

    const roomNumber = req.body.roomNumber;
    const bookings = await BookedRoom.find({number: `${roomNumber}`})
    console.log(bookings)

})

router.post("/cancelbooking", async(req, res)=>{

    const email = req.body.email;
    const id = req.body.id;

    // console.log(id)

    const order = await BookedRoom.findById(id)

    if (order["email"]!=email) {
        res.end("Wrong Credentials!")
    }

    // console.log(order)

    const price = order["totalPrice"]

    let timeLeft = Math.abs(order["startDateTime"] - Date.now())

    timeLeft = Math.floor(timeLeft/(1000*60*60))

    console.log("Hours left = ", timeLeft)
    
    let refund;

    if (timeLeft>48) {
        refund = price;
    }

    else if (timeLeft>24) {
        refund = price/2;
    }

    else {
        refund = 0;
    }

    console.log("refund = ", refund)

    await BookedRoom.deleteOne(order);

    res.send("Ok")

})

module.exports = router;