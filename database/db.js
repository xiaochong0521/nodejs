var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/xiaochong');//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var userScheMa = new Schema({
	name: String,
	tel: Number,
	addr: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联

exports.users = db.model('name', userScheMa); //  与users集合关联