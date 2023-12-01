export default function configuration() {
  return {
    port: parseInt(process.env.SERVER_PORT, 10) || 5000,
    app_url: process.env.APP_URL,
    database: {
      db_connection_uri: process.env.DATABASE_URI,
    },
    jwt_secret: process.env.JWT_SECRET,
    mail: {
      user: process.env.MJ_APIKEY_PUBLIC,
      pass: process.env.MJ_APIKEY_PRIVATE,
      from: process.env.MAIL_FROM,
    },
  };
}
