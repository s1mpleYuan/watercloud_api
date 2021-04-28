const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadServ = require('../services/uploadService');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/charts/')
  },
  filename: function (req, file, cb) {
    let filename = file.originalname.split('*')[0];
    cb(null, `${filename}.${file.mimetype.split('/')[1]}`);
  }
})

const upload = multer({ storage: storage })

/////////////////////////////////////////////////////////////////  上传生成图表历史记录
router.post('/uploadHistoryChartRecord',
  upload.single('upload'),
  (req, res, next) => {
    const { file } = req;
    if (!file) {
      return res.sendResult(null, 400, '请上传upload图表记录图片');
    } else next();
  },
  (req, res, next) => {
    // 已上传到服务器路径/uploads/charts/下
    // 将文件路径地址传入数据库
    const { file } = req;
    let number = file.originalname.split('*')[0].split('-')[1];
    let content = file.originalname.split('*')[1];
    let filepath = file.destination;
    let filename = file.filename;
    const obj = {
      number,
      content,
      filepath,
      filename
    }
    // console.log(obj, '14444');
    uploadServ.saveImageFilePath(obj).then((value) => {
      if (value.affectedRows > 0) {
        return res.sendResult(null, 200, '上传成功!');
      } else return res.sendResult(null, 500, '上传失败!');
    }).catch((err) => {
      return res.sendResult(null, 500, err);
    })
  }
)

module.exports = router;