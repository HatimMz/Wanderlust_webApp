const express = require("express")
const router = express.Router();
const { ListingSchema } = require("../models/joiSchema.js");
const Listing = require("../models/listings/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const customError = require("../utils/customError.js")
const { isLoggedIn, isOwner } = require("../utils/middlewares.js")


//listing validator middleware
function validateListing(req, res, next) {
    const { error } = ListingSchema.validate(req.body.listing || req.body, { convert: true, allowUnknown: true });
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        return next(new customError(400, msg));
    }
    next();
}

// index route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.json(allListings);
}));


// new route
router.get("/new", isLoggedIn, wrapAsync(async (req, res, next) => {
    res.json({ message: "Create listing form available in the React client." });
}));


// create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const source = req.body.listing || req.body;
    const newLisiting = new Listing(source);
    newLisiting.owner = req.user._id
    await newLisiting.save();

    res.status(201).json({ message: "Listing added successfully", listing: newLisiting });
}));



// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const deletedListing = await Listing.findByIdAndDelete(id);

    res.json({ message: "Listing deleted successfully", deletedListing });

}));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {

    const id = req.params.id;
    const reqListing = await Listing.findById(id);
    if (!reqListing) {
        return res.status(404).json({ message: "Listing does not exist" })
    }
    else {
        res.json(reqListing)
    }

}));


// PATCH route
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {

    const id = req.params.id;
    const updatedListing = req.body.listing || req.body;
    ListingSchema.validate(updatedListing);
    const listing = await Listing.findByIdAndUpdate(id, { ...updatedListing }, { new: true });

    res.json({ message: "Listing updated successfully", listing });

}));


// get route
router.get("/:id", wrapAsync(async (req, res, next) => {

    const id = req.params.id;
    const reqListing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!reqListing) {
        return res.status(404).json({ message: "Listing does not exist" })
    }
    else {
        res.json(reqListing);
    }

}));


module.exports = router;