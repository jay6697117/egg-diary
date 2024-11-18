'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret); // 传入加密字符串

  const prefix = '/api';
  router.get('/', _jwt, controller.home.index);// 登录首页
  router.get(`${prefix}/user_list`, _jwt, controller.home.userList); // 查user_list
  router.get(`${prefix}/users`, _jwt, controller.home.users); // 查users
  router.post(`${prefix}/add_user`, _jwt, controller.home.addUser); // 增
  router.post(`${prefix}/edit_user`, _jwt, controller.home.editUser); // 改
  router.post(`${prefix}/delete_user`, _jwt, controller.home.deleteUser); // 删
  router.post(`${prefix}/user/register`, controller.user.register); // 注册
  router.post(`${prefix}/user/login`, controller.user.login); // 登录
  router.get(`${prefix}/user/test`, _jwt, controller.user.test); // 验证
};
