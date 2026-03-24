// Script to seed founder account
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const UserSchema = new mongoose.Schema({
    user_id: String,
    firstName: String,
    lastName: String,
    gender: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, default: 'user' }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function seedFounder() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Check if founder exists
        const existingFounder = await User.findOne({ role: 'founder' })
        if (existingFounder) {
            console.log('👑 Founder already exists:', existingFounder.email)
            process.exit(0)
        }

        // Create founder
        const hashedPassword = await bcrypt.hash('Founder@123', 10)

        const founder = await User.create({
            firstName: 'Founder',
            lastName: 'Edukon',
            email: 'founder@edukon.com',
            password: hashedPassword,
            role: 'founder'
        })

        console.log('👑 Founder created successfully!')
        console.log('   Email: founder@edukon.com')
        console.log('   Password: Founder@123')
        console.log('   Role: founder')

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

seedFounder()
