export default function configuration() {
  return {
    port: parseInt(process.env.SERVER_PORT, 10) || 5000,
    database: {
      db_connection_uri: process.env.DATABASE_URI,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    //Facbook
    fb_client_id: process.env.FB_CLIENT_ID,
    fb_client_secret: process.env.FB_CLIENT_SECRET,
    public_url: process.env.PUBLIC_URL,
    //Mail
    mail: {
      user: process.env.MJ_APIKEY_PUBLIC,
      pass: process.env.MJ_APIKEY_PRIVATE,
      from: process.env.MAIL_FROM,
    },
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    client_url: process.env.CLIENT_URL,
  };
}
