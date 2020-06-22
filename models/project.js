const mongoose = require('mongoose'),
		User = require('./user');

const projectSchema = new mongoose.Schema({
	name: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	description: String,
	created: {
		type: Date,
		default: Date.now()
	}
	
});
module.exports = mongoose.model('Project', projectSchema);