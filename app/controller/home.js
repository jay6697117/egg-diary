'use strict';

const { Controller } = require('egg');


class HomeController extends Controller {
  // 首页
  async index() {
    const { ctx } = this;
    // ctx.render 默认会去 view 文件夹寻找 index.html，这是 Egg 约定好的。
    await ctx.render('index.html', {
      title: '我是张金辉' // 将 title 传入 index.html
    });
    // ctx.body = `<h1>${JSON.stringify(ctx.query)}</h1>`;
  }

  // ------------------- 以下是新增的代码 -------------------
  // 获取用户列表
  async userList() {
    const { ctx } = this;
    const result = await ctx.service.home.userList();
    ctx.body = result;
  }

  // 获取用户集
  async users() {
    const { ctx } = this;
    const result = await ctx.service.home.users();
    ctx.body = result;
  }

  async addUser() {
    const { ctx } = this;
    const { name, age } = ctx.request.body;
    try {
      const result = await ctx.service.home.addUser({ name, age });
      ctx.body = {
        code: 200,
        message: '添加成功',
        data: result
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '添加失败',
        data: null
      };
    }
  }


  async editUser() {
    const { ctx } = this;
    const { id, name, age } = ctx.request.body;
    try {
      const { result } = await ctx.service.home.editUser({ id, name, age });
      console.log('Controller result:>> ', result);
      ctx.body = {
        code: 200,
        message: '修改成功',
        data: result
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '修改失败',
        data: null
      };
    }
  }

  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const { result } = await ctx.service.home.deleteUser({ id });
      console.log('Controller deleteUser result:>> ', result);
      ctx.body = {
        code: 200,
        message: '删除成功',
        data: result || null
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '删除失败',
        data: null
      };
    }
  }
}

module.exports = HomeController;
