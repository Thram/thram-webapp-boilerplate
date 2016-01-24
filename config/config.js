module.exports = {
  development: {
    server  : {
      port : 3000,
      debug: true
    },
    paths   : {
      server: './',
      client: './client',
      public: './public'
    },
    username: "postgres",
    password: null,
    database: "database_dev",
    host    : "127.0.0.1",
    dialect : "postgres"
  }
};
