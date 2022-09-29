module.exports = mongoose => {
    const User = mongoose.model(
        "user",
        mongoose.Schema(
            {
                nickname: { type: String, unique: true },
                address: { type: String },
                code: { type: String }
            },
            { timestamps: true }
        )
    );

    return User;
};