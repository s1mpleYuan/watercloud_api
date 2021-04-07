# 1.数据预警系统 API接口文档

## 1.1 API 接口说明

+ 接口基准地址：`http://127.0.0.1:8888/`
+ api 服务已开启 CORS 跨域支持。
+ 除登录之外必须使用 Token 认证。
  + token验证（已过期的）：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ5dWFucWluZ3lhbiIsInN1YiI6InRva2VuQXV0aCIsImlhdCI6MTYxNzYxNTU4MywiZXhwIjoxNjE4MjE1NTgzfQ.yumT0t81YOZ0rPxOMFw1cT6_7esJHA7sdWc5cA6UUsw
+ 统一响应为 JSON 格式，格式为：

| 参数名 | 参数说明                                   |
| ------ | ------------------------------------------ |
| data   | 数据（后续接口的响应参数）                 |
| code   | Http响应状态码                             |
| msg    | 接口返回的信息，包含成功信息或错误失败信息 |

### 1.1.1. 支持的请求方法

- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。
- HEAD：获取资源的元数据。
- OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。

### 1.1.2 接口返回状态说明

| http状态码 | 含义                  | 说明                           |
| ---------- | --------------------- | ------------------------------ |
| 200        | OK                    | 请求成功                       |
| 201        | Created               | 创建成功                       |
| 202        | Updated               | 修改成功                       |
| 203        | Deleted               | 删除成功                       |
| 400        | Request Error         | 请求地址不存在或参数错误       |
| 401        | No Authorized         | 未授权（没有Token或Token过期） |
| 403        | Forbidden             | 访问失败                       |
| 404        | Not Found             | 请求的资源不存在               |
| 500        | Internal Server Error | 内部错误                       |

## 1.2 用户 Users

### 1.2.1 登录接口说明

+ 请求路径：`/users/login`
+ 请求类型：**post**
+ 请求参数：

| 参数名   | 参数说明         | 备注     |
| -------- | ---------------- | -------- |
| loginStr | 登录用户名或账号 | 不能为空 |
| password | 密码             | 不能为空 |

+ 响应参数

| 参数名       | 参数说明               | 备注                                |
| ------------ | ---------------------- | ----------------------------------- |
| username     | 用户的账户名           |                                     |
| account      | 用户的账号             |                                     |
| code         | 账户所属的企业         |                                     |
| enabled      | 账户是否被封禁         | 1为未被封禁，0为已封禁              |
| auth         | 账户的权限             | 1为管理员，2为用户（供水/物业公司） |
| en_name      | 账户所属企业的名称     |                                     |
| addr         | 账户所属企业的地址     |                                     |
| legal_person | 账户所属企业的法人     |                                     |
| tele         | 账户所属企业的联系方式 |                                     |

+ 响应格式：

```json
{
    "data": {
        "username": "yqy1",
        "account": "20172203222",
        "code": "000",
        "enabled": 1,
        "auth": 1,
        "en_name": "鲁东大学",
        "addr": "山东省烟台市芝罘区红旗中路世回尧街道",
        "legal_person": "xxx",
        "tele": "xxx-xxx-xxxx",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ5dWFucWluZ3lhbiIsInN1YiI6InRva2VuQXV0aCIsImlhdCI6MTYxNzgwMjYzNSwiZXhwIjoxNjE3ODA0NDM1fQ.u85zzzrTgxpdqu8erjFJIybnX6AQe4yQhn1YskMwc60"
    },
    "code": 200,
    "msg": "登录成功"
}
```

## 1.3 企业 Enterprise

### 1.3.1 查询所有注册企业信息

+ 请求路径：`/enterprises/getEnterpriseList`
+ 请求类型：**get**
+ 请求参数：无
+ 响应格式：

```json
{
    "data":[
        {
            "enterprise_code": "956",
            "enterprise_name": "Yata",
            "enterprise_addr": "3 Graedel Circle",
            "legal_person": "伟菘",
            "enterprise_tele": "780-535-7135"
        },
        {
            "enterprise_code": "9686",
            "enterprise_name": "Twitterbridge",
            "enterprise_addr": "9993 Fieldstone Pass",
            "legal_person": "亦涵",
            "enterprise_tele": "715-637-6247"
        }
    ],
    "code": 200,
    "msg": "查询成功！"
}
```

## 1.4 WaterMeter 水表

### 1.4.1 查询水表抄收记录

+ 请求路径：`/watermeter/queryWaterMeterCopyRecords`
+ 请求类型：**post**
+ 请求参数：

| 参数名    | 参数说明             | 备注                                     |
| --------- | -------------------- | ---------------------------------------- |
| condition | 查询搜索过滤值       | 可为空，意为没有搜索条件条件，但不为null |
| fields    | 需要查询的字段的数组 | 数组长度可为0 即 查询全部，但不为null    |

+ 响应格式：

```json
{
    "data":[
        {
            "Record_id": 2,
            "Task_id": 1,
            "User_code": "370602011011001",
            "House_number": "",
            "Equipment_code": "LXL20C2103030010",
            "Settled_traffic": 0,
            "Cumulative_traffic": 0,
            "Last_used": 0,
            "Balance": 0,
            "Voltage": 0,
            "Signal_strength": 0,
            "Consumption": 0,
            "Status": "0",
            "Equipment_time": "2021-03-13T01:24:30.000Z",
            "Copy_time": "2021-03-13T01:24:43.000Z"
        },
        // ...
    ],
    "code": 200,
    "msg": "查询成功！"
}
```

