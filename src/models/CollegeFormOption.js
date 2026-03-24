import mongoose from 'mongoose'

// Schema for college-specific courses and branches
const CollegeFormOptionSchema = new mongoose.Schema(
    {
        college: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        courses: [{
            type: String,
            trim: true
        }],
        branches: [{
            type: String,
            trim: true
        }],
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

// Index for faster queries
CollegeFormOptionSchema.index({ college: 1, active: 1 })

const CollegeFormOption = mongoose.models.CollegeFormOption || mongoose.model('CollegeFormOption', CollegeFormOptionSchema)

export default CollegeFormOption
