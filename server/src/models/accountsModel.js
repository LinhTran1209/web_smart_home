import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        full_name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["Admin", "member"],
            default: "member",
    },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        collection: "accounts"
    }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;