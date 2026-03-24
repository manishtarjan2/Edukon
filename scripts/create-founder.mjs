import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Use the same MongoDB URI as .env.local
const MONGODB_URI = 'mongodb+srv://manishtarjan2_db_user:manishtarjan_DB2@cluster0.uxxkbs3.mongodb.net/edukon?retryWrites=true&w=majority&appName=Cluster0';

// Define User schema inline (to avoid import issues with ESM)
const UserSchema = new mongoose.Schema({
    user_id: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    college: { type: String },
    collegePreferences: [{ type: String }],
    allottedCollege: { type: String },
    course: { type: String },
    branch: { type: String },
    percentage12th: { type: String },
    jeePercentile: { type: String },
    provincialState: { type: String },
    paymentStatus: { type: String, default: 'pending' },
    role: { type: String, default: 'user' },
    assignedWork: { type: String }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createFounder() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const founderEmail = 'founder@edukon.com';
        const founderPassword = 'Founder@123';

        // Delete existing founder if any
        const deleted = await User.deleteOne({ email: founderEmail });
        if (deleted.deletedCount > 0) {
            console.log('✅ Deleted existing founder user');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(founderPassword, 10);

        // Create fresh founder user
        const founder = await User.create({
            firstName: 'Founder',
            email: founderEmail,
            password: hashedPassword,
            role: 'founder'
        });

        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('👑 Founder account created successfully!');
        console.log('═══════════════════════════════════════');
        console.log('📧 Email:    ', founderEmail);
        console.log('🔐 Password: ', founderPassword);
        console.log('👤 Role:     ', founder.role);
        console.log('═══════════════════════════════════════');
        console.log('');
        console.log('Go to /admin/login and use these credentials!');
        console.log('After login, you will have access to the Founder Dashboard.');
        console.log('');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating founder:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createFounder();
