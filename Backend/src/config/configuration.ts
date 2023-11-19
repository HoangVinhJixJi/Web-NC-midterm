export default function configuration() {
  return {
    port: parseInt(process.env.SERVER_PORT, 10) || 5000,
    database: {
      db_connection_uri: process.env.DATABASE_URI,
    },
    jwt_secret: process.env.JWT_SECRET,
  };
}
