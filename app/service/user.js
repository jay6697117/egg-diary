'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('users', { username });
      console.log('getUserByName result :>> ', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async registerUser(userInfo) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('users', userInfo);
      console.log('register result :>> ', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateUserToken(userId, token) {
    const { app } = this;
    try {
      await app.mysql.update(
        'users',
        {
          current_token: token
        },
        {
          where: { id: userId }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // 根据用户ID获取用户信息
  async getUserById(id) {
    const { app } = this;
    try {
      const result = await app.mysql.get('users', { id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
