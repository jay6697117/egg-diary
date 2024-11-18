'use strict';

module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    let decode;

    if (token !== 'null' && token) {
      try {
        // 1. 验证token的有效性
        decode = ctx.app.jwt.verify(token, secret);

        // 2. 从数据库获取该用户最新的token
        const userInfo = await ctx.service.user.getUserById(decode.id);

        console.log('middleware userInfo :>> ', userInfo);
        // 3. 验证token是否是最新的
        if (!userInfo || userInfo.current_token !== token) {
          ctx.status = 200;
          ctx.body = {
            msg: '登录令牌已失效，请重新登录-1',
            code: 401,
          };
          return;
        }

        await next();
      } catch (error) {
        console.log('error', error);
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期，请重新登录-2',
          code: 401,
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在-3',
      };
      return;
    }
  };
};
