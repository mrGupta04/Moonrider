import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  googleId?: string;
  githubId?: string;
  authProvider: "local" | "google" | "github";
  avatar?: string;
  instagram?: string;
  leetcode?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: {
      type: String,
      required: function (this: IUserDocument) {
        return this.authProvider === "local";
      },
      minlength: 6,
    },
    phone: { 
      type: String, 
      trim: true 
    },
    googleId: { 
      type: String, 
      sparse: true 
    },
    githubId: { 
      type: String, 
      sparse: true 
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    avatar: { 
      type: String,
      default: null 
    },
    instagram: { 
      type: String,
      trim: true 
    },
    leetcode: { 
      type: String,
      trim: true 
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    if (this.password && this.authProvider === "local") {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password || this.authProvider !== "local") {
    return false;
  }
  
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Virtual for getting avatar URL
userSchema.virtual('avatarUrl').get(function() {
  if (!this.avatar) return null;
  
  // If avatar is a URL (from OAuth), return as is
  if (this.avatar.startsWith('http')) {
    return this.avatar;
  }
  
  // If avatar is a local file path, construct the URL
  return `${process.env.API_URL || 'http://localhost:5000'}/${this.avatar}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ githubId: 1 });
userSchema.index({ authProvider: 1 });

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;