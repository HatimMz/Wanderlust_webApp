require("dotenv").config({ path: require("node:path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const Listing = require("../models/listings/listing.js");
const initData = require("./data.js");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderLust');
}

async function initDB() {
    await Listing.deleteMany({});
    newData = initData.data.map(obj=>({...obj, owner: "6ab4ef77c59c5163df839b10"}))
    await Listing.insertMany(newData);    
}

async function run() {
  await main();
  await initDB(); 
  console.log("data initialized successfully");
}

run().catch(err=>console.log(err));
// console.log(initData.data);

