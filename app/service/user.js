'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(data) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.get('user', { username: data.username });
      console.log('getUserByName result :>> ', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async registerUser(data) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.insert('user', { ...data });
      console.log('register result :>> ', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
