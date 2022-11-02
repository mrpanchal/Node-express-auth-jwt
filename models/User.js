const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
});

//Fire a function after doc is created and saved
// userSchema.post('save', function (doc, next) {
//     console.log('New user was created and saved', doc);
//     next();
// });

//Fire a function before a doc is created
userSchema.pre('save', async function (next) {
    // console.log('User is baout to be created and saved', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//static method to login user
// 2 mehtods.
///////// 1st method ///////
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

////////// 2nd method ////////
// userSchema.statics.login = async function (email, password) {
//     const user = await this.findOne({ email });
//     if (!user) {
//         throw Error('Incorrect Email')
//     }

//     const auth = await bcrypt.compare(password, user.password)
//     if (!auth) {
//         throw Error('Incorrect password')
//     }

//     return user;
// }

const User = mongoose.model('user', userSchema);

module.exports = User;
