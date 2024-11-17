'use strict';

const { Controller } = require('egg');
const dayjs = require('dayjs'); // 引入方式 1

// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
const defaultSignature = `我是签名-${Date.now()}`; // 使用模板字符串替代字符串拼接
const defaultCtimeFn = timestamp => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};
class UserController extends Controller {
  // 注册接口
  async register() {
    const { ctx } = this;
    try {
      const { username, password, ctime, avatar, signature } = ctx.request.body;
      // 验证数据库内是否已经有该账户名
      const userInfo = await ctx.service.user.getUserByName(username); // 获取用户信息
      console.log('register userInfo :>> ', userInfo);

      if (!username || !password) {
        ctx.body = {
          code: 500,
          message: 'register 账号密码不能为空',
          data: null
        };
        return;
      }
      // 判断是否已经存在
      if (userInfo?.id) {
        ctx.body = {
          code: 500,
          message: 'register 账户名已被注册，请重新输入',
          data: null
        };
        return;
      }

      // 调用 service 方法，将数据存入数据库。
      // username和password ctime,avatar和signature是选填项
      const result = await ctx.service.user.registerUser({
        username,
        password,
        ctime: defaultCtimeFn(ctime),
        avatar: avatar || defaultAvatar,
        signature: signature || defaultSignature
      });
      console.log('register result:', result);

      if (result && result.insertId) {
        ctx.body = {
          code: 200,
          message: 'register 注册成功',
          data: {
            id: result.insertId,
            username,
            password,
            ctime: defaultCtimeFn(ctime),
            avatar: avatar || defaultAvatar,
            signature: signature || defaultSignature
          }
        };
      } else {
        ctx.body = {
          code: 500,
          message: 'register 注册失败',
          data: null
        };
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        message: 'register 注册失败',
        data: null
      };
    }
  }
  async login() {
    console.log('login run');
    // app 为全局属性，相当于所有的插件方法都植入到了 app 对象。
    const { app, ctx } = this;
    // 获取请求体
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserByName(username);
    console.log('userInfo login:', userInfo);
    // 没找到说明没有该用户
    if (!userInfo?.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null
      };
      return;
    }
    // 找到用户，并且判断输入密码与数据库中用户密码。
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null
      };
      return;
    }

    // 生成 token
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，上文已经提到过。
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // token 有效期为 24 小时
    }, app.config.jwt.secret);

    console.log('token :>> ', token);
    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token
      },
    };
  }
}

module.exports = UserController;
