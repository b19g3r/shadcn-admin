# myservice API Documentation

## Introduction
### Base URL

- local: http://localhost:9000


## 用户登录

`POST` /login

### Description

用户登录

### Request Parameters

- Body Parameters. JSON object format description:

```json
{
  "username": "string //用户名",
  "password": "string //密码",
  "captcha": "string //验证码",
  "captchaId": "string //验证码标识"
}
```

### Response

- Response Parameters. JSON object format description:

```json
{
  "code": "integer //状态码",
  "message": "string //返回信息",
  "data": {
    "userId": "integer //用户ID",
    "username": "string //用户名",
    "accessToken": "string //访问令牌",
    "refreshToken": "string //刷新令牌",
    "expiresIn": "integer //过期时间",
    "roles": [
      "string //角色列表"
    ]
  }
}
```


## 注册

`POST` /register

### Description

注册

### Request Parameters

- Body Parameters. JSON object format description:

```json
{
  "username": "string //用户名",
  "password": "string //密码<br/>todo 更加复杂的密码校验",
  "confirmPassword": "string //确认密码",
  "nickname": "string //昵称",
  "phone": "string //手机号",
  "email": "string //邮箱",
  "captcha": "string //验证码",
  "captchaId": "string //验证码标识"
}
```

### Response

- Response Parameters. JSON object format description:

```json
{
  "code": "integer //状态码",
  "message": "string //返回信息",
  "data": {}
}
```


## 刷新Token

`POST` /refresh

### Description

刷新Token

### Request Parameters

- Body Parameters. JSON object format description:

```json
{
  "MAP_KEY": "string //"
}
```

### Response

- Response Parameters. JSON object format description:

```json
{
  "code": "integer //状态码",
  "message": "string //返回信息",
  "data": {
    "userId": "integer //用户ID",
    "username": "string //用户名",
    "nickname": "string //昵称",
    "avatar": "string //头像",
    "accessToken": "string //访问令牌",
    "refreshToken": "string //刷新令牌",
    "expiresIn": "integer //过期时间",
    "roles": [
      "string //角色列表"
    ]
  }
}
```


## 登出

`POST` /logout

### Description

登出

### Request Parameters

None

### Response

- Response Parameters. JSON object format description:

```json
{
  "code": "integer //状态码",
  "message": "string //返回信息",
  "data": {}
}
```


## generateCaptcha

`GET` /captcha

### Description

None

### Request Parameters

None

### Response

- Response Parameters. JSON object format description:

```json
{
  "code": "integer //状态码",
  "message": "string //返回信息",
  "data": {
    "uuid": "string //",
    "imageData": "string //"
  }
}
```


