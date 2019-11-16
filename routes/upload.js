const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
//上传图片的模板
var multer = require("multer");
//生成的图片放在uploads文件夹下
var upload = multer({dest:"uploads/"});

router.post("/img",upload.single('test'),function (req, res) {
    let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*999);
    let extname = req.file.mimetype.split("/")[1];
    let keepname = time+"."+extname;
        //读取路径(req.file.path)
    console.log(__dirname.slice(0,-7));
    console.log(__dirname);
    console.log(__dirname.slice(0,-7)+"/"+req.file.path);
    fs.rename(req.file.path,'/picture/www/html/pic/'+keepname,function (err) {
        if (!err){ res.json({"path":"114.55.65.22/"+keepname})}
    });
});
//上传音乐
router.post("/music/",upload.single('test'),function (req, res) {
	    //console.log(req.body.uid)
	    //let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*999)
	    //let extname = req.file.mimetype.split("/")[1];
	    //console.log(req.file)
	    //if (extname === "mpeg"){ extname = "mp3";}
	    //let keepname = time+"."+extname
	    //读取路径(req.file.path)
	    //console.log(__dirname.slice(0,-7))
	    //console.log(__dirname)
	    //console.log(__dirname.slice(0,-7)+"\\"+req.file.path)
	    fs.rename(req.file.path,'/picture/www/html/music/'+req.file.originalname,function (err) {
	    if (!err)    {
	            // console.log(keepname)
		    console.log(req.file.originalname)
	      res.json({"path":"114.55.65.22/"+req.file.originalname})
	                  }
      });
});

router.post("/video/",upload.single('test'),function (req, res) {
	    //console.log(req.body.uid)
	    //let time = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*999)
	    //let extname = req.file.mimetype.split("/")[1];
	    //console.log(req.file)
	    //if (extname === "mpeg"){ extname = "mp3";}
	    //let keepname = time+"."+extname
	    fs.rename(req.file.path,'/picture/www/html/video/'+req.file.originalname,function (err) {
	    if (!err)    {
	            // console.log(keepname)
		    console.log(req.file.originalname)
	      res.json({"path":"114.55.65.22/"+req.file.originalname})
	                  }
      });
});
module.exports = router;
