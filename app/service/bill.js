'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  /**
   * 添加账单
   * @param {Object} params - 账单参数
   * @param {number} params.amount - 账单金额
   * @param {number} params.type_id - 账单类型ID
   * @param {string} params.type_name - 账单类型名称
   * @param {string} params.date - 账单日期
   * @param {number} params.pay_type - 支付类型
   * @param {string} params.remark - 备注
   * @param {number} params.user_id - 用户ID
   * @return {Promise<Object|null>} 插入结果或null
   */
  async add(params) {
    const { ctx, app } = this;
    try {
      // 往 bill 表中，插入一条账单数据
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 获取账单列表
  async list(id) {
    const { ctx, app } = this;
    const QUERY_STR = 'id, amount, pay_type, type_id, type_name, date, remark';
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 获取账单详情
  async detail({ id, user_id }) {
    const { ctx, app } = this;
    try {
      // 安全做法：同时验证记录ID和所属用户（推荐）
      // 推荐保留 user_id 的原因：
      // 权限验证：防止用户通过猜测 bill_id 访问他人账单（纵深防御）
      // 数据隔离：确保查询结果严格属于当前用户（user_id 来自 JWT token）
      // 索引优化：如果表中存在 (id, user_id) 的复合索引，查询效率更高
      const result = await app.mysql.get('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 编辑账单
  async update(params) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.update('bill', {
        ...params
      }, {
        id: params.id,
        user_id: params.user_id
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;
