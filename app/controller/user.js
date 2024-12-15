'use strict';

const { Controller } = require('egg');
const dayjs = require('dayjs');

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
const defaultSignature = '我是egg-diary项目签名';
const defaultCtimeFn = timestamp => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

class UserController extends Controller {
  // 统一错误响应方法
  errorResponse(message, code = 500) {
    this.ctx.body = {
      code,
      message,
      data: null
    };
  }

  // 统一成功响应方法
  successResponse(data, message = '操作成功') {
    this.ctx.body = {
      code: 200,
      message,
      data
    };
  }

  async register() {
    const { ctx } = this;
    try {
      const { username, password, ctime, avatar, signature } = ctx.request.body;

      if (!username || !password) {
        return this.errorResponse('账号密码不能为空');
      }

      const userInfo = await ctx.service.user.getUserByName(username);
      if (userInfo?.id) {
        return this.errorResponse('账户名已被注册，请重新输入');
      }

      const result = await ctx.service.user.registerUser({
        username,
        password,
        ctime: defaultCtimeFn(ctime),
        avatar: avatar || defaultAvatar,
        signature: signature || defaultSignature
      });

      if (result && result.insertId) {
        return this.successResponse(
          {
            id: result.insertId,
            username,
            password,
            ctime: defaultCtimeFn(ctime),
            avatar: avatar || defaultAvatar,
            signature: signature || defaultSignature
          },
          '注册成功'
        );
      }
      return this.errorResponse('注册失败，请稍后重试');
    } catch (error) {
      console.error('注册失败:', error);
      return this.errorResponse('注册失败，服务器异常');
    }
  }

  async login() {
    const { app, ctx } = this;
    try {
      const { username, password } = ctx.request.body;

      if (!username || !password) {
        return this.errorResponse('账号密码不能为空');
      }

      const userInfo = await ctx.service.user.getUserByName(username);
      if (!userInfo?.id) {
        return this.errorResponse('账号不存在');
      }

      if (password !== userInfo.password) {
        return this.errorResponse('账号密码错误');
      }

      const token = app.jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小时有效期
          // exp: Math.floor(Date.now() / 1000) + 20 // 测试用 20秒有效期
        },
        app.config.jwt.secret
      );

      await ctx.service.user.updateUserToken(userInfo.id, token);
      return this.successResponse({ token }, '登录成功');
    } catch (error) {
      console.error('登录失败:', error);
      return this.errorResponse('登录失败，服务器异常');
    }
  }

  // 验证jwt接口
  async test() {
    const { ctx, app } = this;
    try {
      const { authorization: token } = ctx.request.header;
      if (!token) {
        return this.errorResponse('未提供认证令牌', 401);
      }

      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      return this.successResponse({ ...decode }, '获取成功');
    } catch (error) {
      console.error('Token验证失败:', error);
      return this.errorResponse('认证失败，请重新登录', 401);
    }
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const { authorization: token } = ctx.request.header;
    // 通过 app.jwt.verify 方法，解析出 token 内的用户信息
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 通过 getUserByName 方法，以用户名 decode.username 为参数，从数据库获取到该用户名下的相关信息
    // const userInfo = await ctx.service.user.getUserByName(decode.username);
    const userInfo = await ctx.service.user.getUserById(decode.id);
    // userInfo 中应该有密码信息，所以我们指定下面四项返回给客户端

    console.log('getUserInfo userInfo:', userInfo);
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.avatar || defaultAvatar,
        signature: userInfo.signature || '',

      }
    };
  }

  // 修改用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    // 通过 post 请求，在请求体中获取签名字段 signature
    const { signature = '', avatar = '' } = ctx.request.body;

    try {
      // let user_id;
      const { authorization: token } = ctx.request.header;
      // 解密 token 中的用户名称
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;

      const user_id = decode.id;
      // 通过 username 查找 userInfo 完整信息
      // const userInfo = await ctx.service.user.getUserByName(decode.username);
      const userInfo = await ctx.service.user.getUserById(decode.id);
      // 通过 service 方法 editUserInfo 修改 signature 和 avatar 信息。
      const result = await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar
      });

      console.log('editUserInfo result:', result);
      console.log('editUserInfo result signature:', signature);
      console.log('editUserInfo result avatar:', avatar);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: user_id,
          signature,
          avatar,
          username: userInfo.username
        }
      };
    } catch (error) {
      console.error('修改用户信息失败:', error);
      return this.errorResponse('修改用户信息失败，服务器异常');
    }
  }
}

module.exports = UserController;
