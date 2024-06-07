var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incomeSchema = new Schema(
  {
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

var Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
