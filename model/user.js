var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, minlength: 4 },
    age: Number,
    phone: Number,
    country: String,
    providers: [String],
    github: {
      photo: String,
    },
    google: {
      photo: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.password && this.isModified) {
    bcrypt
      .hash(this.password, 10)
      .then((pass) => {
        this.password = pass;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
