'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const prefix = '/api';
  router.get('/', controller.home.index);
  router.get(`${prefix}/user/:id`, controller.home.user);
  router.post(`${prefix}/add`, controller.home.add);
  router.get(`${prefix}/user_list`, controller.home.userList); // 查
  router.post(`${prefix}/add_user`, controller.home.addUser); // 增
  router.post(`${prefix}/edit_user`, controller.home.editUser); // 改
  router.post(`${prefix}/delete_user`, controller.home.deleteUser); // 删
  router.post(`${prefix}/user/register`, controller.user.register); // 注册
};
