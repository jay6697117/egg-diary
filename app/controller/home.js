'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  // 首页
  async index() {
    const { ctx } = this;
    // ctx.render 默认会去 view 文件夹寻找 index.html，这是 Egg 约定好的。
    await ctx.render('index.html', {
      title: '我是张金辉', // 将 title 传入 index.html
    });
    // ctx.body = `<h1>${JSON.stringify(ctx.query)}</h1>`;
  }
  // 获取用户信息
  async user() {
    const { ctx } = this;
    ctx.body = `<div>
    <h1 style="color:red;">${JSON.stringify(ctx.params)}</h1>
    <h3>${JSON.stringify(ctx.query)}</h3>
    </div>`;
  }

  // 获取info信息
  async info() {
    const { ctx } = this;
    console.log('ctx :>> ', ctx.service.home.info);
    const result = await ctx.service.home.info();
    ctx.body = result;
  }


  // post 请求方法
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    // Egg 框架内置了 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到 ctx.request.body 上
    ctx.body = {
      title
    };
  }
}

module.exports = HomeController;
