export default function configuration() {
  return {
    port: parseInt(process.env.SERVER_PORT, 10) || 5000,
    database: {
      db_connection_uri: process.env.DATABASE_URI,
    },
    jwt_secret: process.env.JWT_SECRET,
    fb_client_id: process.env.FB_CLIENT_ID,
    fb_client_secret: process.env.FB_CLIENT_SECRET,
    public_url: process.env.PUBLIC_URL,
  };
}
