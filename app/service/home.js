// app/service/home.js
'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async info() {
    // 从数据库获取用户信息
    const users = await this.app.mysql.select('users');
    console.log('users :>> ', users);
    return {
      users
    };
  }
}
module.exports = HomeService;
