# egg-diary 项目架构文档

## 1. 项目概述

egg-diary 是一个基于 Egg.js 框架开发的日记/账单管理系统。该系统主要功能包括用户注册登录、账单管理、文件上传等。系统采用前后端分离的架构，后端提供 RESTful API 接口，前端通过这些接口获取和操作数据。

## 2. 技术栈

- **框架**：Egg.js (基于 Node.js 的企业级框架)
- **数据库**：MySQL
- **认证**：JWT (JSON Web Token)
- **模板引擎**：EJS
- **日期处理**：Moment.js, Day.js
- **跨域处理**：egg-cors
- **其他工具库**：lodash

## 3. 项目结构

项目遵循 Egg.js 的标准目录结构，主要包括：

```
egg-diary/
├── app/                    # 应用代码目录
│   ├── controller/         # 控制器目录
│   │   ├── bill.js         # 账单相关控制器
│   │   ├── home.js         # 首页相关控制器
│   │   ├── upload.js       # 文件上传控制器
│   │   └── user.js         # 用户相关控制器
│   ├── middleware/         # 中间件目录
│   │   └── jwtErr.js       # JWT验证中间件
│   ├── public/             # 静态资源目录
│   │   └── upload/         # 上传文件存储目录
│   ├── service/            # 服务层目录
│   │   ├── bill.js         # 账单相关服务
│   │   ├── home.js         # 首页相关服务
│   │   └── user.js         # 用户相关服务
│   ├── view/               # 视图模板目录
│   │   └── index.html      # 首页模板
│   └── router.js           # 路由配置
├── config/                 # 配置文件目录
│   ├── config.default.js   # 默认配置
│   └── plugin.js           # 插件配置
├── test/                   # 测试目录
├── .eslintrc               # ESLint配置
├── .gitignore              # Git忽略文件
├── jsconfig.json           # JavaScript配置
├── package.json            # 项目依赖
└── README.md               # 项目说明
```

## 4. 数据库设计

根据代码中的服务层和控制器，系统使用了以下数据库表：

### 4.1 users表

存储用户信息：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | int | 主键，用户ID |
| username | varchar | 用户名 |
| password | varchar | 密码（明文存储，生产环境应加密） |
| ctime | datetime | 创建时间 |
| avatar | varchar | 用户头像URL |
| signature | varchar | 用户签名 |
| current_token | varchar | 当前有效的JWT令牌 |

### 4.2 bill表

存储账单信息：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | int | 主键，账单ID |
| user_id | int | 外键，关联用户ID |
| user_name | varchar | 用户名（冗余存储） |
| amount | decimal | 金额 |
| pay_type | int | 支付类型（1: 支出, 2: 收入） |
| type_id | int | 账单类型ID |
| type_name | varchar | 账单类型名称 |
| date | varchar | 账单日期（存储为时间戳字符串） |
| remark | varchar | 备注 |

### 4.3 user_list表

存储用户列表（可能是测试用）：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | int | 主键 |
| name | varchar | 名称 |
| age | int | 年龄 |

## 5. API接口设计

系统提供了以下RESTful API接口：

### 5.1 用户相关接口

| 接口路径 | 方法 | 描述 | 认证要求 |
|---------|------|------|---------|
| /api/user/register | POST | 用户注册 | 无需认证 |
| /api/user/login | POST | 用户登录 | 无需认证 |
| /api/user/test | GET | JWT验证测试 | 需要JWT |
| /api/user/get_user_info | GET | 获取用户信息 | 需要JWT |
| /api/user/edit_user_info | POST | 修改用户信息 | 需要JWT |

### 5.2 账单相关接口

| 接口路径 | 方法 | 描述 | 认证要求 |
|---------|------|------|---------|
| /api/bill/add | POST | 新增账单 | 需要JWT |
| /api/bill/list | GET | 获取账单列表 | 需要JWT |
| /api/bill/detail | GET | 获取账单详情 | 需要JWT |
| /api/bill/update | POST | 修改账单 | 需要JWT |
| /api/bill/delete | POST | 删除账单 | 需要JWT |
| /api/bill/data | GET | 获取账单数据统计 | 需要JWT |

### 5.3 文件上传接口

| 接口路径 | 方法 | 描述 | 认证要求 |
|---------|------|------|---------|
| /api/upload_file | POST | 上传文件 | 需要JWT |

### 5.4 其他接口

| 接口路径 | 方法 | 描述 | 认证要求 |
|---------|------|------|---------|
| / | GET | 首页 | 无需认证 |
| /api/user_list | GET | 获取用户列表 | 需要JWT |
| /api/users | GET | 获取users表用户 | 需要JWT |
| /api/add_user | POST | 添加用户到user_list | 需要JWT |
| /api/delete_user | POST | 删除user_list中用户 | 需要JWT |
| /api/edit_user | POST | 编辑user_list中用户 | 需要JWT |

## 6. 认证与授权机制

### 6.1 JWT认证流程

系统使用JWT（JSON Web Token）进行用户认证，具体流程如下：

1. **用户登录**：
   - 用户提交用户名和密码到 `/api/user/login` 接口
   - 服务器验证用户名和密码
   - 验证成功后，生成包含用户ID和用户名的JWT令牌，有效期为24小时
   - 将令牌存储在数据库的 `users` 表的 `current_token` 字段中
   - 返回令牌给客户端

2. **请求验证**：
   - 客户端在后续请求中，将JWT令牌放在请求头的 `Authorization` 字段中
   - 服务器通过 `jwtErr` 中间件验证令牌的有效性
   - 中间件验证包括：令牌解析、令牌有效期检查、与数据库中存储的令牌比对
   - 验证通过后，请求继续处理；验证失败，返回401错误

### 6.2 JWT中间件实现

`jwtErr` 中间件的主要功能：

- 从请求头获取 `Authorization` 字段中的令牌
- 使用 `app.jwt.verify` 方法验证令牌的有效性
- 从数据库中获取用户信息，并比对令牌是否匹配
- 验证通过则调用 `next()` 继续处理请求，否则返回401错误

### 6.3 安全考虑

- 系统实现了令牌刷新机制，每次登录都会生成新令牌
- 数据库存储当前有效令牌，可以实现令牌失效和强制登出
- 敏感操作（如账单管理）都需要验证用户身份和所有权
- 账单操作验证了用户ID与账单所有者ID的匹配关系，防止越权访问

## 7. 文件上传功能

### 7.1 上传配置

系统使用Egg.js的内置文件上传功能，主要配置如下：

- 上传模式：`file`模式
- 文件大小限制：100MB
- 文件类型：允许所有类型
- 文件数量限制：10个
- 临时文件目录：`app/public/temp`
- 临时文件清理：每3600秒清理一次

### 7.2 上传流程

1. 客户端通过 `/api/upload_file` 接口上传文件
2. 服务器接收文件并存储在临时目录
3. 生成基于日期的目录结构（YYYYMMDD格式）
4. 生成唯一文件名（原文件名_时间戳.扩展名）
5. 将文件从临时目录移动到永久存储目录（`app/public/upload/YYYYMMDD/`）
6. 返回文件的相对URL路径给客户端
7. 清理临时文件

### 7.3 安全考虑

- 上传接口需要JWT认证，确保只有登录用户可以上传文件
- 生成随机文件名，防止文件名冲突和猜测
- 使用日期目录结构，便于管理和清理
- 上传完成后清理临时文件，防止磁盘空间浪费

## 8. 错误处理机制

### 8.1 统一响应格式

系统采用统一的响应格式，包括：

```json
{
  "code": 200/400/401/500,  // 状态码
  "msg"/"message": "消息内容",  // 提示信息
  "data": null/{}           // 数据内容
}
```

- `code`: 状态码，200表示成功，400表示参数错误，401表示认证失败，500表示服务器错误
- `msg`/`message`: 提示信息，描述操作结果或错误原因
- `data`: 返回的数据，成功时包含相关数据，失败时通常为null

### 8.2 错误处理策略

1. **参数验证**：
   - 在控制器层进行参数验证，确保必要参数存在且格式正确
   - 参数错误时返回400状态码和明确的错误信息

2. **认证错误**：
   - 通过JWT中间件统一处理认证错误
   - 认证失败时返回401状态码和相应错误信息
   - 区分不同认证错误类型（令牌缺失、令牌过期、令牌无效等）

3. **数据库错误**：
   - 在服务层捕获数据库操作异常
   - 记录详细错误日志，但对客户端隐藏具体错误细节
   - 返回500状态码和通用错误信息

4. **文件上传错误**：
   - 验证文件存在性和有效性
   - 捕获文件操作异常
   - 返回相应状态码和错误信息

### 8.3 错误日志

- 系统使用`console.log`和`console.error`记录错误信息
- 在生产环境中，应考虑使用更完善的日志系统
- 关键操作（如登录、注册、账单修改）都有日志记录

## 9. 代码组织与模式

### 9.1 MVC架构

系统采用典型的MVC（Model-View-Controller）架构：

- **Model**：通过Service层实现，负责数据访问和业务逻辑
- **View**：使用EJS模板引擎，但主要作为API服务器，视图较少
- **Controller**：处理HTTP请求，调用Service层，返回响应

### 9.2 分层设计

1. **路由层（Router）**：
   - 定义API路径和HTTP方法
   - 关联中间件和控制器方法
   - 集中管理API入口点

2. **控制器层（Controller）**：
   - 处理HTTP请求和响应
   - 参数验证和格式化
   - 调用服务层方法
   - 格式化响应数据

3. **服务层（Service）**：
   - 实现业务逻辑
   - 数据库访问和操作
   - 数据处理和转换
   - 错误处理和日志记录

4. **中间件层（Middleware）**：
   - 请求预处理
   - 认证和授权
   - 跨域处理
   - 错误捕获

### 9.3 代码复用

- 使用统一的响应格式方法（如UserController中的errorResponse和successResponse）
- 服务层方法的模块化设计，便于复用
- 中间件的通用设计，可应用于多个路由

## 10. 部署与运维

### 10.1 启动脚本

系统提供了以下npm脚本：

- `npm start`: 以守护进程方式启动服务器
- `npm stop`: 停止服务器
- `npm run dev`: 开发模式启动服务器
- `npm test`: 运行测试
- `npm run lint`: 代码风格检查

### 10.2 调试配置

系统配置了VSCode调试设置，支持：

- Egg Debug：调试开发环境
- Egg Test：调试测试环境

### 10.3 环境要求

- Node.js >= 18.0.0
- MySQL数据库
- 支持文件上传的服务器配置

## 11. 总结与建议

### 11.1 系统概述

egg-diary是一个基于Egg.js框架开发的账单管理系统，提供用户认证、账单管理、文件上传等功能。系统采用MVC架构，使用MySQL数据库存储数据，JWT进行用户认证。

### 11.2 系统优势

1. **框架选择**：
   - 使用Egg.js框架，提供了良好的项目结构和开发规范
   - 利用Egg.js的插件系统，简化了常见功能的实现

2. **安全性**：
   - 实现了JWT认证机制，保护API接口
   - 账单操作验证用户所有权，防止越权访问
   - 文件上传有安全措施，防止恶意文件上传

3. **代码组织**：
   - 清晰的分层设计，职责分明
   - 统一的错误处理和响应格式
   - 模块化的服务设计，便于维护和扩展

### 11.3 改进建议

1. **安全性增强**：
   - 密码应使用加密存储，而非明文
   - 考虑实现CSRF防护机制
   - 增加请求频率限制，防止暴力攻击

2. **代码质量**：
   - 增加单元测试覆盖率
   - 使用TypeScript提供类型安全
   - 完善错误日志系统，使用专业日志工具

3. **功能扩展**：
   - 实现账单类型的管理功能
   - 添加数据统计和可视化功能
   - 考虑实现多用户角色和权限系统

4. **性能优化**：
   - 实现数据库查询缓存
   - 优化大量数据的分页查询
   - 考虑使用CDN加速静态资源

### 11.4 技术债务

1. **代码中的TODO和注释**：
   - 有些代码中包含测试用的注释和未完成的功能
   - 应清理这些代码，确保生产环境代码的清晰性

2. **错误处理不一致**：
   - 不同控制器中的错误处理方式不一致
   - 应统一错误处理方式，提高代码可维护性

3. **配置管理**：
   - 敏感配置（如JWT密钥）直接硬编码在配置文件中
   - 应使用环境变量或配置中心管理敏感配置

4. **日志系统**：
   - 当前使用console.log记录日志
   - 应使用专业日志系统，支持日志级别和日志轮转

## 12. 架构图

### 12.1 系统架构图

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  客户端应用       |<--->|  Egg.js 服务器    |<--->|  MySQL 数据库     |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
                               |
                               |
                         +------------------+
                         |                  |
                         |  文件存储系统      |
                         |                  |
                         +------------------+
```

### 12.2 请求流程图

```
客户端 -> 路由层 -> JWT中间件 -> 控制器层 -> 服务层 -> 数据库
   ^                                |
   |                                v
   +--------------------------------+
              响应返回
```

### 12.3 认证流程图

```
1. 登录请求 -> 验证凭据 -> 生成JWT -> 存储令牌 -> 返回令牌
2. API请求 -> JWT中间件 -> 验证令牌 -> 验证通过 -> 处理请求
                            |
                            v
                         验证失败 -> 返回401错误
```

## 结语

本架构文档提供了egg-diary项目的全面概述，包括技术栈、项目结构、数据库设计、API接口、认证机制、错误处理等方面的详细说明，以及对系统的评估和改进建议。希望这份文档能帮助开发者或新团队成员快速理解项目的整体结构和工作原理，同时也可以作为项目维护和优化的参考。
