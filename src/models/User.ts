import mongoose, { Schema, models } from "mongoose";

export interface ICollegePreferenceDetail {
  college: string;
  course: string;
  branch: string;
}

export interface IUser {
  _id: string;
  user_id?: string;
  firstName: string;
  lastName?: string;
  gender?: string;
  email: string;
  password?: string;
  phone?: string;
  college?: string;
  collegePreferences?: string[];
  collegePreferenceDetails?: ICollegePreferenceDetail[];
  allottedCollege?: string;
  course?: string;
  branch?: string;
  percentage12th?: string;
  jeePercentile?: string;
  provincialState?: string;
  paymentStatus: string;
  role: string;
  assignedWork?: string;
  createdBy?: string;
}

const UserSchema = new Schema<IUser>(
  {
    user_id: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    college: { type: String },
    collegePreferences: [{ type: String }],
    collegePreferenceDetails: [{
      college: { type: String },
      course: { type: String },
      branch: { type: String }
    }],
    allottedCollege: { type: String },
    course: { type: String },
    branch: { type: String },
    percentage12th: { type: String },
    jeePercentile: { type: String },
    provincialState: { type: String },
    paymentStatus: { type: String, default: 'pending' },
    role: { type: String, default: "user" },
    assignedWork: { type: String },
    createdBy: { type: String }
  },
  { timestamps: true }
);

const User = (models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
