const express = require("express")
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../models/joiSchema.js");
const Listing = require("../models/listings/listing.js");
const Review = require("../models/reviews/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const customError = require("../utils/customError.js")
const {isLoggedIn, isAuthor} = require("../utils/middlewares.js")


//reviewValidation(joi) middleware
function reviewValidation(req, res, next){
    const {error} = reviewSchema.validate(req.body.review)
    if (error)
    {
        const msg = error.details.map((d)=>d.message).join(', ')
        return next(new customError(400, msg))
    }
    next()
}


//Create review route
router.post("/", isLoggedIn, reviewValidation, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const reviewBody = req.body.review || req.body;

    const newReview = new Review(reviewBody);
    newReview.author = req.user._id
    await newReview.save();

    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await listing.save();

    res.status(201).json({ message: "Review added successfully!", review: newReview });

}));



// delete review route
router.delete("/:id2", isLoggedIn, isAuthor, wrapAsync(async (req, res, next) => {

    const { id, id2 } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: id2 } })
    const reviewDeleted = await Review.findByIdAndDelete(id2)

    res.json({ message: "Review deleted successfully!", reviewDeleted });

}));

module.exports = router;