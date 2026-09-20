const Listing = require("../models/listings/listing");
const Review = require("../models/reviews/reviews")

function isApiRequest(req) {
    return req.originalUrl.startsWith("/api/") || req.path.startsWith("/api/")
}

function isLoggedIn(req, res, next){
    if (!req.isAuthenticated()){
        if (isApiRequest(req)) {
            return res.status(401).json({ message: "You must be logged in." })
        }
        return res.status(401).json({ message: "You must be logged in." })
    }
    next()

}

function saveRedirectUrl(req, res, next){
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}


async function isOwner(req, res, next){
    const id = req.params.id;
    const reqListing = await Listing.findById(id)

    if (!reqListing || !reqListing.owner || !reqListing.owner.equals(req.user._id))
    {
        if (isApiRequest(req)) {
            return res.status(403).json({ message: "You don't have access to this listing." })
        }
        return res.status(403).json({ message: "You don't have access to this listing." })
    }
    next()
}

async function isAuthor(req, res, next){
    const {id, id2} = req.params;
    const reqReview = await Review.findById(id2)

    if (!reqReview || !reqReview.author || !reqReview.author.equals(req.user._id))
    {
        if (isApiRequest(req)) {
            return res.status(403).json({ message: "You don't have access to this review." })
        }
        return res.status(403).json({ message: "You don't have access to this review." })
    }
    next()
}

module.exports = {isLoggedIn, saveRedirectUrl, isOwner, isAuthor}