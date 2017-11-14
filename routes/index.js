var express = require('express');
var router = express.Router();
var user = require('../database/db').users;
var TestModel = require('../database/db');
// var multer  = require('multer')
// var uploadimg = multer({ dest: 'upload/images/' });
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//设置跨域访问  
router.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'index' });
});

/* login */
router.get('/login', function (req, res) {
  res.render('login', { title: 'login' });
});

/* ucenter */
router.post('/ucenter', function (req, res) {
  var query = { name: req.body.name, password: req.body.password };
  (function () {
    user.count(query, function (err, doc) {    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
      if (doc == 1) {
        console.log(query.name + ": 登陆成功 " + new Date());
        res.render('ucenter', { title: 'ucenter' });
      } else {
        console.log(query.name + ": 登陆失败 " + new Date());
        res.redirect('/');
      }
    });
  })(query);
});

var arr;

//查询数据
user.find({}, function (err, results) {
  if (err) {
    console.log('error message', err);
    return;
  }
  arr = results;
  return arr;
});


//插入数据
router.get("/add", function (req, res) {
  user.create(req.query, function (error, doc) {
    console.log(TestModel)
    if (error) {
      console.log(error);
    } else {
      console.log(doc);
    }
  });
});

//展示所有数据
router.post('/ajax', function (req, res) {
  user.find({}, function (err, docs) {
    res.send(docs);
  }).limit(2);
  //res.send(arr);
});

//删除数据
router.get('/delete', function (req, res) {
  // let conditions = {name: 'xulei'};
  var conditions = req.query;
  // console.log(conditions);
  user.remove(conditions, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Delete success!');
    }
  });
})

//修改数据
router.get('/change', function (req, res) {
  // var conditions = {name : 'test_update'};
  // var update = {$set : { age : 16 }};
  // req.query.changdata
  var conditions = req.query.changdata;
  var update = { $set: req.query.updata };
  console.log(req.query.updata);
  // console.log(conditions);
  // console.log(update)
  // $set 表示只修改 age，否则全覆盖
  user.update(conditions, update, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Update success!');
    }
  });

})

//查找数据
router.get('/search', function (req, res) {
  var name = req.query;
  user.find(name, function (error, docs) {
    if (error) {
      console.log("error :" + error);
    } else {
      res.send(docs); //docs: age为28的所有文档
    }
  });
})

//上传文件

router.post('/fileUpload', multipartMiddleware, function (req, res) {

  // console.log(req.body);
  var arr = [];
  for (var i in req.files) {
    arr.push(req.files[i])
  }
  // for(var j in arr[0]){
  // console.log(arr[0].name)
  // }
  // console.log(arr);
  // 获得文件的临时路径
  var tmp_path = arr[0].path;
  // 指定文件上传后的目录 - 示例为"images"目录。
  if (arr[0].type.substr(0, 5) == 'image') {
    var target_path = './upload/images/' + arr[0].name;
  } else {
    var target_path = './upload/files/' + arr[0].name;
  }
  //  // 移动文件
  fs.rename(tmp_path, target_path, function (err) {
    if (err) throw err;
    // 删除临时文件夹文件, 
    fs.unlink(tmp_path, function () {
      if (err) throw err;
      res.send('File uploaded to: ' + target_path + ' - ' + arr[0].size + ' bytes');
    });
  });

});


//分页
router.post('/index/pagelist', function (req, res) {
  // var count=0;
  var page = req.body.page;
  var rows = req.body.rows;

  // //计算分页数据
  user.find({}, function (err, docs) {
    res.send(docs);
  }).skip((page - 1) * 2).limit(2);

});

module.exports = router;
