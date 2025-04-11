# Shadcn Admin 后端接口设计

## 1. 认证服务接口 (auth-service)

### 1.1 用户认证
```
POST /api/v1/auth/login
请求头:
Content-Type: application/json
请求体:
{
  "username": string,  // 用户名或邮箱
  "password": string
}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "accessToken": string,
    "refreshToken": string,
    "user": {
      "id": string,      // 用户ID，在前端保存为accountNo
      "username": string,
      "email": string,
      "role": string[],  // 用户角色数组
      "exp": number      // 令牌过期时间戳
    }
  }
}

错误响应示例 (401):
{
  "code": 401,
  "message": "Invalid credentials",
  "errors": [
    {
      "field": "username",
      "message": "Invalid username or password"
    }
  ]
}
```

### 1.2 刷新令牌
```
POST /api/v1/auth/refresh
请求头:
Content-Type: application/json
请求体:
{
  "refreshToken": string
}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "accessToken": string,
    "refreshToken": string
  }
}
```

### 1.3 登出
```
POST /api/v1/auth/logout
请求头:
Authorization: Bearer {token}
Content-Type: application/json
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "message": "Successfully logged out"
  }
}
```

## 2. 用户管理接口 (user-service)

### 2.1 获取用户列表
```
GET /api/v1/users
请求头:
Authorization: Bearer {token}
查询参数:
- page: number (默认: 1)
- size: number (默认: 10)
- search: string (可选)
- role: string (可选)
- status: string (可选)
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": string,
        "firstName": string,
        "lastName": string,
        "username": string,
        "email": string,
        "phoneNumber": string,
        "status": "active" | "inactive" | "invited" | "suspended",
        "role": "superadmin" | "admin" | "manager" | "cashier",
        "createdAt": string,
        "updatedAt": string
      }
    ],
    "totalElements": number,
    "totalPages": number,
    "size": number,
    "number": number
  }
}
```

### 2.2 创建用户
```
POST /api/v1/users
请求头:
Authorization: Bearer {token}
Content-Type: application/json
请求体:
{
  "firstName": string,
  "lastName": string,
  "username": string,
  "email": string,
  "phoneNumber": string,
  "password": string,
  "role": string
}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": string,
    "firstName": string,
    "lastName": string,
    "username": string,
    "email": string,
    "phoneNumber": string,
    "status": string,
    "role": string,
    "createdAt": string,
    "updatedAt": string
  }
}
```

### 2.3 更新用户
```
PUT /api/v1/users/{id}
请求头:
Authorization: Bearer {token}
Content-Type: application/json
请求体:
{
  "firstName": string,
  "lastName": string,
  "username": string,
  "email": string,
  "phoneNumber": string,
  "role": string,
  "password": string (可选)
}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": string,
    "firstName": string,
    "lastName": string,
    "username": string,
    "email": string,
    "phoneNumber": string,
    "status": string,
    "role": string,
    "createdAt": string,
    "updatedAt": string
  }
}
```

### 2.4 删除用户
```
DELETE /api/v1/users/{id}
请求头:
Authorization: Bearer {token}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "message": "User deleted successfully"
  }
}
```

### 2.5 邀请用户
```
POST /api/v1/users/invite
请求头:
Authorization: Bearer {token}
Content-Type: application/json
请求体:
{
  "email": string,
  "role": string,
  "description": string (可选)
}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "message": "Invitation sent successfully",
    "invitationId": string
  }
}
```

## 3. 系统管理接口 (system-service)

### 3.1 获取菜单列表
```
GET /api/v1/menus
请求头:
Authorization: Bearer {token}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "menus": [
      {
        "id": string,
        "title": string,
        "icon": string,
        "path": string,
        "parentId": string | null,
        "order": number,
        "permissions": string[]
      }
    ]
  }
}
```

### 3.2 获取系统配置
```
GET /api/v1/system/config
请求头:
Authorization: Bearer {token}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "theme": {
      "defaultTheme": string,
      "storageKey": string
    },
    "security": {
      "passwordPolicy": {
        "minLength": number,
        "requireNumbers": boolean,
        "requireLowercase": boolean,
        "requireUppercase": boolean,
        "requireSpecialChars": boolean
      }
    }
  }
}
```

### 3.3 获取操作日志
```
GET /api/v1/system/logs
请求头:
Authorization: Bearer {token}
查询参数:
- page: number
- size: number
- startDate: string (可选)
- endDate: string (可选)
- type: string (可选)
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": string,
        "userId": string,
        "username": string,
        "action": string,
        "type": string,
        "ip": string,
        "userAgent": string,
        "createdAt": string
      }
    ],
    "totalElements": number,
    "totalPages": number,
    "size": number,
    "number": number
  }
}
```

## 4. 文件服务接口 (file-service)

### 4.1 上传文件
```
POST /api/v1/files/upload
请求头:
Authorization: Bearer {token}
Content-Type: multipart/form-data
请求体:
- file: File
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": string,
    "filename": string,
    "url": string,
    "size": number,
    "mimeType": string,
    "createdAt": string
  }
}
```

### 4.2 获取文件列表
```
GET /api/v1/files
请求头:
Authorization: Bearer {token}
查询参数:
- page: number
- size: number
- type: string (可选)
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": string,
        "filename": string,
        "url": string,
        "size": number,
        "mimeType": string,
        "createdAt": string
      }
    ],
    "totalElements": number,
    "totalPages": number,
    "size": number,
    "number": number
  }
}
```

### 4.3 删除文件
```
DELETE /api/v1/files/{id}
请求头:
Authorization: Bearer {token}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "message": "File deleted successfully"
  }
}
```

## 5. 消息服务接口 (message-service)

### 5.1 发送站内消息
```
POST /api/v1/messages
请求头:
Authorization: Bearer {token}
Content-Type: application/json
请求体:
{
  "to": string[],
  "subject": string,
  "content": string,
  "type": "notification" | "email" | "sms"
}
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": string,
    "status": "sent" | "failed",
    "createdAt": string
  }
}
```

### 5.2 获取消息列表
```
GET /api/v1/messages
请求头:
Authorization: Bearer {token}
查询参数:
- page: number
- size: number
- type: string (可选)
- status: string (可选)
响应:
{
  "code": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": string,
        "from": string,
        "to": string[],
        "subject": string,
        "content": string,
        "type": string,
        "status": string,
        "createdAt": string
      }
    ],
    "totalElements": number,
    "totalPages": number,
    "size": number,
    "number": number
  }
}
```

## 6. 通用响应格式

### 6.1 成功响应
```json
{
  "code": 200,
  "message": "Success",
  "data": any
}
```

### 6.2 错误响应
```json
{
  "code": number,
  "message": string,
  "errors": [
    {
      "field": string,
      "message": string
    }
  ]
}
```

## 7. 错误码说明

- 200: 成功
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器内部错误
- 503: 服务不可用 