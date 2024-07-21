const mongoose = require('mongoose')
async function dbConnect(){
    DBURL="mongodb+srv://21bcsb49:12345@atlascluster.fegktxs.mongodb.net/"
    DBNAME="squbix"
    try {
        await mongoose.connect(DBURL+""+DBNAME)
        console.log("Database Connected");
    } catch (error) {
        console.log("Connection Error "+error );
    }

}
module.exports = dbConnect