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
}

module.exports = HomeController;
