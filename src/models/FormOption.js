import mongoose from 'mongoose'

const FormOptionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['college', 'branch', 'course'],
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

// Compound index for faster queries
FormOptionSchema.index({ type: 1, active: 1 })

const FormOption = mongoose.models.FormOption || mongoose.model('FormOption', FormOptionSchema)

export default FormOption
