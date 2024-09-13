'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
  // 注册接口
  async register() {
    const { ctx } = this;
    try {
      const { username, password, avatar, signature } = ctx.request.body;
      // 验证数据库内是否已经有该账户名
      const userInfo = await ctx.service.user.getUserByName({ username }); // 获取用户信息
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
      const data = await ctx.service.user.registerUser({
        username,
        password,
        ctime: Date.now().toString(),
        avatar,
        signature
      });
      console.log('register data:', data);

      if (data && data.insertId) {
        ctx.body = {
          code: 200,
          message: 'register 注册成功',
          data: {
            id: data.insertId,
            username,
            password,
            ctime: Date.now().toString(),
            avatar,
            signature
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
}

module.exports = UserController;
