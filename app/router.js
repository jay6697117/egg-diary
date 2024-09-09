'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user/:id', controller.home.user);
  router.post('/add', controller.home.add);
  router.get('/user_list', controller.home.userList);
  router.post('/add_user', controller.home.addUser);
};
