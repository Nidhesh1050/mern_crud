const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const ImageModel = mongoose.model("Image", imageSchema)
module.exports = ImageModel