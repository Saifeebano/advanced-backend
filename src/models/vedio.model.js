import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema({

    vediofile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    duration: {
        type: Number, //cloudnary m second mai aaega
        required: true
    },
    view: {
        type: Number,
        default: 0
    },
    ispublished: {
        type: Boolean,
        default: true
    },
    publishAt: {
        type: Date,
        default: Date.now()
    }


}, {
    timestamps: true
})

vedioSchema.plugin(mongooseAggregatePaginate)


export const video = mongoose.model("video", vedioSchema)