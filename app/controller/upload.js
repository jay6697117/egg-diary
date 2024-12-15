'use strict';

const fs = require('fs').promises;
const moment = require('moment');
const path = require('path');
const { Controller } = require('egg');

class UploadController extends Controller {
  async uploadFile() {
    const { ctx } = this;
    const file = ctx.request.files[0];

    if (!file) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        msg: '没有检测到上传文件',
      };
      return;
    }

    try {
      const uploadDir = await this.saveFile(file);

      ctx.body = {
        code: 200,
        msg: '上传成功',
        data: uploadDir.replace(/app/g, ''),
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        msg: '文件上传失败',
        error: error.message,
      };
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }
  }

  async saveFile(file) {
    // 生成保存路径
    const day = moment().format('YYYYMMDD');
    const dir = path.join(this.config.uploadDir, day);
    // 获取文件内容
    const fileContent = await fs.readFile(file.filepath);

    console.log('file.filename :>> ', file.filename, path.extname(file.filename));
    // 获取原始文件名（不带后缀）
    const fileNameWithoutExt = path.parse(file.filename).name;
    // 生成新文件名
    const fileName = `${fileNameWithoutExt}_${Date.now()}${path.extname(file.filename)}`;
    console.log('fileName :>> ', fileName);
    const uploadDir = path.join(dir, fileName);

    // 创建目录并保存文件
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(uploadDir, fileContent);

    return uploadDir;
  }
}

module.exports = UploadController;
