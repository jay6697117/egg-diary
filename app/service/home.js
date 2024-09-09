// app/service/home.js
'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async userList() {
    const { ctx, app } = this;
    const QUERY_STR = 'id, name,age';
    const sql = `select ${QUERY_STR} from user_list`; // 获取 id 的 sql 语句
    try {
      const result = await app.mysql.query(sql); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addUser(params) {
    const { ctx, app } = this;
    const { name, age } = params;
    try {
      const result = await app.mysql.insert('user_list', { name, age });
      return { name, age, id: result.insertId };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = HomeService;
