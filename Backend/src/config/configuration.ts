export default function configuration() {
  return {
    port: parseInt(process.env.PORT) || 3000,
    database: {
      db_connection_url: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.7yugkxi.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
    },
  };
}
