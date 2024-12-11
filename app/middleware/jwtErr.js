'use strict';

module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;

    if (!token || token === 'null') {
      ctx.body = {
        code: 401,
        msg: '未提供访问令牌1111'
      };
      return;
    }

    try {
      const decode = ctx.app.jwt.verify(token, secret);
      const userInfo = await ctx.service.user.getUserById(decode.id);

      if (!userInfo || userInfo.current_token !== token) {
        ctx.body = {
          code: 401,
          msg: '登录令牌已失效，请重新登录'
        };
        return;
      }

      await next();
    } catch (error) {
      console.log('JWT验证错误:', error);
      ctx.body = {
        code: 401,
        msg: '令牌已过期或无效，请重新登录'
      };
      return;
    }
  };
};
