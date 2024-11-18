'use strict';

module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;

    if (!token || token === 'null') {
      return ctx.body = {
        code: 401,
        msg: '未提供访问令牌'
      };
    }

    try {
      const decode = ctx.app.jwt.verify(token, secret);
      const userInfo = await ctx.service.user.getUserById(decode.id);

      if (!userInfo || userInfo.current_token !== token) {
        return ctx.body = {
          code: 401,
          msg: '登录令牌已失效，请重新登录'
        };
      }

      await next();
    } catch (error) {
      console.log('JWT验证错误:', error);
      return ctx.body = {
        code: 401,
        msg: '令牌已过期或无效，请重新登录'
      };
    }
  };
};
