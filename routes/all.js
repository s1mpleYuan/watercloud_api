const express = require('express');
const router = express.Router();
const axios = require('axios');
const amap_config = require('config').get('amap_config');

//////////////////////////////////////////////////////////////// 查询天气
router.get('/queryWeather',
  (req, res, next) => {
    const { city, extensions } = req.query;
    if (!city) {
      return res.sendResult(null, 400, '请传入city参数');
    } else if (!extensions) {
      return res.sendResult(null, 400, '请传入extensions参数');
    } else if (extensions !== 'base' && extensions !== 'all') {
      return res.sendResult(null, 400, 'extensions参数只能为base或all');
    } else next();
  },
  async (req, res) => {
    const { city, extensions } = req.query;
    const { data } = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
      params: {
        city,
        extensions,
        key: amap_config.get('key')
      }
    });
    const { status, infocode, lives, forecasts } = data;
    if (status === '1') {
      if (extensions === 'base') {
        return res.sendResult(lives[0], 200, '查询成功！');
      } else {
        return res.sendResult(forecasts[0], 200, '查询成功！');
      }
    } else {
      let type = extensions === 'base' ? '实时天气' : '预报天气';
      return res.sendResult(null, 500, `查询${type}天气失败，infocode : ${infocode}`);
    }
  }
)

module.exports = router;