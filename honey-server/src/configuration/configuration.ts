export default () => ({
  api_port: process.env.API_PORT,
  sms_otp_expire_time: process.env.SMS_OTP_EXPIRE_TIME,
  sms_phone_number: process.env.SMS_PHONE_NUMBER,
  otp_code_length: 6,
  db: {
    uri: process.env.MONGODB_URI,
  },
  pino: {
    no_color: process.env.NO_COLOR,
    log_level: process.env.LOG_LEVEL,
  },
  minio: {
    port: process.env.MINIO_PORT,
    access_key: process.env.MINIO_ACCESS_KEY,
    secret_key: process.env.MINIO_SECRET_KEY,
    end_point: process.env.MINIO_END_POINT,
    bucket: process.env.MINIO_BUCKET,
  },
  twilio: {
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
  },
  gmail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    mail_from: process.env.MAIL_FROM,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    index_db: process.env.REDIS_DB,
  },
  jwt: {
    secret_key: process.env.JWT_SECRET_KEY,
    access_token_expire_time: 600000, // 10 minutes
    refresh_token_expire_time: 155520000000, // 30 days
    algorithm: 'HS256',
    public_key: process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
    private_key: process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
})
