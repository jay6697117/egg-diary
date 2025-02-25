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

  // 账单列表
  async list() {
    const { ctx, app } = this;
    // 获取，日期 date，分页数据，类型 type_id，这些都是我们在前端传给后端的数据
    const { date, page = 1, page_size = 1, type_id = 'all' } = ctx.query;

    try {
      // 通过 token 解析，拿到 user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      // 拿到当前用户的账单列表
      const list = await ctx.service.bill.list(user_id);
      console.log('list :>> ', list);
      // 过滤出月份和类型所对应的账单列表
      const _list = list.filter(item => {
        console.log('moment :>> ', moment(Number(item.date)).format('YYYY-MM'));
        // 非全部
        if (type_id !== 'all') {
          return moment(Number(item.date)).format('YYYY-MM') === date && type_id === item.type_id;
        }
        // 全部
        return moment(Number(item.date)).format('YYYY-MM') === date;
      });
      // 格式化数据，将其变成我们之前设置好的对象格式
      const listMap = _list
        .reduce((curr, item) => {
          // curr 默认初始值是一个空数组 []
          // 把第一个账单项的时间格式化为 YYYY-MM-DD
          const date = moment(Number(item.date)).format('YYYY-MM-DD');
          // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
          if (curr && curr.length && curr.findIndex(item => item.date === date) > -1) {
            const index = curr.findIndex(item => item.date === date);
            curr[index].bills.push(item);
          }
          // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
          if (curr && curr.length && curr.findIndex(item => item.date === date) === -1) {
            curr.push({
              date,
              bills: [ item ]
            });
          }
          // 如果 curr 为空数组，则默认添加第一个账单项 item ，格式化为下列模式
          if (!curr.length) {
            curr.push({
              date,
              bills: [ item ]
            });
          }
          return curr;
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date)); // 时间顺序为倒叙，时间约新的，在越上面

      // 分页处理，listMap 为我们格式化后的全部数据，还未分页。
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);

      // 计算当月总收入和支出
      // 首先获取当月所有账单列表
      const __list = list.filter(item => moment(Number(item.date)).format('YYYY-MM') === date);
      // 累加计算支出
      const totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      // 累加计算收入
      const totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      // 返回数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: Math.ceil(listMap.length / page_size), // 总分页
          list: filterListMap || [] // 格式化后，并且经过分页处理的数据
        }
      };
    } catch {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      };
    }
  }
}

module.exports = BillController;
