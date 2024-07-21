const mongoose = require('mongoose');

const connectDb = async () => {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
};

const closeDb = async () => {
    await mongoose.connection.close();
};

module.exports = { connectDb, closeDb };
