const mongoose = require("mongoose");
const Listing = require("../models/listings/listing.js");
const initData = require("./data.js");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

async function initDB() {
    await Listing.deleteMany({});
    newData = initData.data.map(obj=>({...obj, owner: "6a8dd173b532e5963c98912a"}))
    await Listing.insertMany(newData);    
}

async function run() {
  await main();
  await initDB(); 
  console.log("data initialized successfully");
}

run().catch(err=>console.log(err));
// console.log(initData.data);


