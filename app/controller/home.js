const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = `<h1>${JSON.stringify(ctx.query)}</h1>`;
  }
  // 获取用户信息
  async user() {
    const { ctx } = this;
    ctx.body = `<div>
    <h1 style="color:red;">${JSON.stringify(ctx.params)}</h1>
    <h3>${JSON.stringify(ctx.query)}</h3>
    </div>`;
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
