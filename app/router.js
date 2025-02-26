'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret); // 传入加密字符串

  const prefix = '/api';
  router.get('/', controller.home.index); // 首页: 无jwt
  router.get(`${prefix}/user_list`, _jwt, controller.home.userList); // 查user_list
  router.get(`${prefix}/users`, _jwt, controller.home.users); // 查users
  router.post(`${prefix}/add_user`, _jwt, controller.home.addUser); // 增
  router.post(`${prefix}/delete_user`, _jwt, controller.home.deleteUser); // 删
  router.post(`${prefix}/edit_user`, _jwt, controller.home.editUser); // 改
  router.post(`${prefix}/user/register`, controller.user.register); // 注册: 无jwt
  router.post(`${prefix}/user/login`, controller.user.login); // 登录: 无jwt
  router.get(`${prefix}/user/test`, _jwt, controller.user.test); // 验证jwt
  router.get(`${prefix}/user/get_user_info`, _jwt, controller.user.getUserInfo); // 获取用户信息
  router.post(`${prefix}/user/edit_user_info`, _jwt, controller.user.editUserInfo); // 修改用户信息
  router.post(`${prefix}/upload_file`, _jwt, controller.upload.uploadFile); // 上传文件
  router.post(`${prefix}/bill/add`, _jwt, controller.bill.add); // 新增账单
  router.get(`${prefix}/bill/list`, _jwt, controller.bill.list); // 获取账单列表
  router.get(`${prefix}/bill/detail`, _jwt, controller.bill.detail); // 获取账单详情
  router.post(`${prefix}/bill/update`, _jwt, controller.bill.update); // 修改账单
};
