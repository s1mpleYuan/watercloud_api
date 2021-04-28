const express = require('express');
const router = express.Router();
const chartServ = require('../services/chartService');
const usersServ = require('../services/usersService');

router.post('/getGenerateChartsData',
  (req, res, next) => {
    const { region, chartOptions } = req.body;
    if (!region) {
      return res.sendResult(null, 400, '请传入region参数');
    } else if (!chartOptions) {
      return res.sendResult(null, 400, '请传入chartOptions参数')
    } else next();
  },
  (req, res) => {
    const { region, chartOptions } = req.body;
    let regionId = "";
    for (const i in region) {
      regionId = region[i] ? region[i] : regionId;
    }
    const { model } = chartOptions;
    if (model === "0") {
      // 水表使用数据
      const { dataContent, chartType, dateValue, dateUnit } = chartOptions;
      let taskId = "1";
      chartServ.getWaterUseChartData(taskId, dataContent, dateValue, dateUnit, (err, result) => {
        if (err) {
          return res.sendResult(null, 500, err);
        } else if (result) {
          switch (dataContent) {
            case 'Settled_traffic':
              var title = `${dateValue[0]} 至 ${dateValue[1]} 的结算流量`;
              var yAxisTitle = '结算流量'
              break;
            case 'Cumulative_traffic':
              var title = `${dateValue[0]} 至 ${dateValue[1]} 的累计流量 `;
              var yAxisTitle = '累计流量'
              break;
            case 'Last_used':
              var title = `${dateValue[0]} 至 ${dateValue[1]} 的上月使用`;
              var yAxisTitle = '上月使用'
              break;
            default:
              break;
          }
          usersServ.getRegionName(regionId).then((value) => {
            let final = {
              title: `${value.name}  ${title}`,
              xAxisTitle: '时间',
              yAxisTitle,
              chartType,
              dateUnit,
              data: result
            };
            return res.sendResult(final, 200, '成功');
          }).catch((val) => {
            return res.sendResult(null, 500, val);
          })
        }
      });
    } else {
      // 单水表设备数据
      const { dataContent, equipment_code, dateValue, dateUnit } = chartOptions;
      let taskId = "1";
      chartServ.getWaterEquipmentChartData(taskId, equipment_code, dataContent, dateValue, (err, result) => {
        if (err) {
          return res.sendResult(null, 500, err);
        } else if (result) {
          switch (dataContent) {
            case 'Voltage':
              var title = `${dateValue[0]} 至 ${dateValue[1]} 的电压`;
              var yAxisTitle = '电压'
              break;
            case 'Signal_strength':
              var title = `${dateValue[0]} 至 ${dateValue[1]} 的信号强度`;
              var yAxisTitle = '信号强度'
              break;
            case 'Consumption':
              var title = `${dateValue[0]} 至 ${dateValue[1]} 的电耗`;
              var yAxisTitle = '电耗'
              break;
            default:
              break;
          }
          usersServ.getRegionName(regionId).then((value) => {
            let final = {
              title: `设备编号 ${equipment_code} : ${title}`,
              yAxisTitle,
              chartType: 'line',
              dateUnit,
              data: result
            };
            return res.sendResult(final, 200, '成功');
          }).catch((val) => {
            return res.sendResult(null, 500, val);
          });
        }
      });
    }
  }
)


module.exports = router;