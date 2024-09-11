'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user/:id', controller.home.user);
  router.post('/add', controller.home.add);
  router.get('/user_list', controller.home.userList); // 查
  router.post('/add_user', controller.home.addUser); // 增
  router.post('/edit_user', controller.home.editUser); // 改
  router.post('/delete_user', controller.home.deleteUser); // 改
};
