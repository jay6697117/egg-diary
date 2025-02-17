'use strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class BillController extends Controller {
  /**
   * 添加账单
   * @return {Promise<void>}
   */
  async add() {
    const { ctx, app } = this;
    // 获取请求中携带的参数
    const { amount, pay_type, type_id, type_name, remark = '' } = ctx.request.body;

    // 判空处理，确保必要参数都已提供
    if (!amount || !type_id || !type_name || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      };
      return; // 添加return以防止继续执行
    }

    try {
      // 从请求头获取token
      const token = ctx.request.header.authorization;
      // 验证token并解码用户信息
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) {
        ctx.body = {
          code: 401,
          msg: '登录状态已过期',
          data: null
        };
        return;
      }
      const { id: user_id, username: user_name } = decode;

      // 调用service层方法添加账单
      const result = await ctx.service.bill.add({
        user_id,
        user_name,
        amount,
        pay_type,
        type_id,
        type_name,
        date: Date.now() + '',
        remark
      });

      console.log('add controller result :>> ', result);

      // 返回成功响应
      ctx.body = {
        code: 200,
        msg: '添加成功',
        // data: null
        data: result
      };
    } catch (error) {
      // 错误处理
      console.error('添加账单失败:', error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      };
    }
  }
}

module.exports = BillController;
