var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

//保存图片
const fs = require('fs');
const path = require('path');
//上传图片的模板
var multer = require("multer");
//生成的图片放在uploads文件夹下
var upload = multer({dest:"uploads/"});


var Schema = mongoose.Schema;
var userSchema =new Schema({

	uid:String,
	pwd:String,
	name:String,
	school:String,
	age:Number,
	pic:String,
	gender:{
		type:String,
		default:"male"
	}
});
var user =mongoose.model("user",userSchema);

//通过uid查询，返回json类型的uid
// 1.用于验证该账号是否注册过
//localhost:3000/users/sign_up?uid=xxx
router.get('/sign_up/', function(req, res) {
	user.find({uid:req.query.uid},{uid:1,_id:0},function (err, newUser) {
		res.json(newUser);
		console.log(typeof newUser)
	})
});


//向数据库中写入数据，注册账号(带图片)

router.post("/sign_up/",upload.single('img'),function (req, res) {
	console.log(req.body.uid);
	let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*999);
	let extname = req.file.mimetype.split("/")[1];
	let keepname = time+"."+extname;
	fs.rename(req.file.path,'/picture/www/html/pic/'+keepname,function (err) {
		if (!err)    {
			console.log(req.body);
			req.body.pic = keepname
			user.create(req.body,function (err, newUser) {
				if (!err){
					res.send(newUser);
					console.log(req.body)
					console.log("创建用户成功~");
					console.log(newUser);
					console.log(keepname);
				}
			})
		}
	});
});


//向数据库中写入数据，注册账号(不带图片)
// localhost:3000/users/sign_up
//router.post('/sign_up/',function (req,res) {
//
//    console.log(req.body);
//    user.create(req.body,function (err, newUser) {
//      if (!err){
//        res.send(newUser);
//        console.log("创建用户成功~");
//        console.log(newUser);
//      }
//    })
//
//});


//输入账号，显示所有信息
router.get('/sign_in/', function(req, res) {
	user.find({uid:req.query.uid},function (err, newUser) {
		res.json(newUser);
		console.log(typeof newUser)
	})
});


//登录，如果传入的账号密码正确，返回True，否则返回False
//localhost:3000/users/sign_in?uid=xxx&pwd=xxxxxx
router.get('/sign_in/', function(req, res) {
	user.find({uid:req.query.uid},{uid:1,pwd:1,_id:0},function (err, newUser) {
		console.log(newUser.length);
		if (newUser.length===0)  res.send("False1");
		else  {
			user.find({uid:req.query.uid,pwd:req.query.pwd},function (err, newUser) {
				if (newUser.length===0)  res.send("False2");
				else           res.json(newUser);
			})
		}
	})
});


//修改密码
// 查询密码是否正确，如果传入的账号密码正确，返回True，否则返回False
//localhost:3000/users/reset_pwd?uid=xxx&pwd=xxxxxx
router.get('/reset_pwd/', function(req, res) {
	user.find({uid:req.query.uid,pwd:req.query.pwd},{uid:1,pwd:1,_id:0},function (err, newUser) {
		console.log(newUser.length);
		if (newUser.length===0)  {res.json({"state":"False"});}
		else  res.json({"state":"True"})
	})
});

//修改密码
//在数据库中改写密码
// localhost:3000/users/reset_pwd
router.post('/reset_pwd/',function (req,res) {

	console.log(req.body.pwd);
	user.findOne({uid:req.body.uid},function (err, doc) {
		if (!err){
			console.log(doc);
			doc.updateOne({$set:{pwd:req.body.pwd}},function (err) {
				if (!err){
					console.log("用户密码修改成功~");
					res.json({"state":"True"})
				}
				else res.json({"state":"False"})
			})
		}
	})


});


//修改头像
router.post("/res_pic/",upload.single('rimg'),function (req, res) {
	let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*999);
	let extname = req.file.mimetype.split("/")[1];
	let keepname = time+"."+extname;
	console.log(keepname);
	fs.rename(req.file.path,'/picture/www/html/pic/'+keepname,function (err) {
		if (!err)    {
			// console.log(req.body.uid);
			user.findOne({uid:req.body.uid},function (err, doc) {
				if (!err){
					//console.log(doc);
					doc.updateOne({$set:{pic:keepname}},function (err) {
						if (!err){
							console.log("用户头像修改成功~");
							res.send(keepname)
						}

					})
				}
			})
		}
	});
});


module.exports = router;
