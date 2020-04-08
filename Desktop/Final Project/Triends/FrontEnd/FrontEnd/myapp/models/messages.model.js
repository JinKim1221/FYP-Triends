var mongoose = require('mongoose');

var chattingSchema = new mongoose.Schema({
	sender: String,
    msg: String,
    receiver: String,
    updated_at: { type: Date, default: Date.now },
});

mongoose.model('messages', chattingSchema);