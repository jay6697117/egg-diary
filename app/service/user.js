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
      console.log('getUserById result :>> ', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 修改用户信息
  async editUserInfo(params) {
    const { ctx, app } = this;
    try {
    // 通过 app.mysql.update 方法，指定 user 表，
      const result = await app.mysql.update('users', {
        ...params // 要修改的参数体，直接通过 ... 扩展操作符展开
      }, {
        id: params.id // 筛选出 id 等于 params.id 的用户
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
