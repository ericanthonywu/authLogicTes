const mongoose = require('mongoose');

require('dotenv').config({
    path:'.env',
})

mongoose.connect(`mongodb://localhost/${process.env.DBNAME}`, {
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(r => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
}).catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, lowercase: true, unique: true},
    nickname: {type: String},
    password: {type: String, required: true},
    email: {type: String, unique: true, trim: true, required: true},
    email_status: {type: Boolean, default: false},
    email_verification_token: {type: Number},
    email_verification_token_expire: {type: Date},
    phone: {type: String},
    phone_code: {type: String, default: "+62"}
}, {timestamps: true})

exports.user = mongoose.model('user', userSchema);
