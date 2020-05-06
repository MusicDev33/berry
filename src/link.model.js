const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  href: {type: String, required: true, unique: true}
});


const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
