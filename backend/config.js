module.exports = {
  // 服务器端口
  PORT: 3000,
  // 数据库配置
  DB: {
    host: 'localhost',
    user: 'root',
    password: '你的数据库密码',
    database: 'class_system'
  },
  // 阿里云OSS配置（自行申请）
  OSS: {
    region: 'oss-cn-beijing',
    accessKeyId: '你的AK',
    accessKeySecret: '你的SK',
    bucket: '你的bucket名'
  },
  // JWT密钥
  JWT_SECRET: 'class_system_2025'
};