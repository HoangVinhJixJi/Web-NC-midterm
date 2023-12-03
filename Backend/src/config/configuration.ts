export default function configuration() {
  return {
    port: parseInt(process.env.SERVER_PORT, 10) || 5000,
    database: {
      db_connection_uri: process.env.DATABASE_URI,
    },
    jwt_secret: process.env.JWT_SECRET,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    public_url: process.env.PUBLIC_URL,
    fronend_url: process.env.FRONTEND_URL,
  };
}
