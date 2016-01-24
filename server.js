/**
 * Created by Thram on 24/01/16.
 */
var app   = require('koa')(),
    serve = require('koa-static-folder');

var web     = require('./routes/web'),
    users   = require('./routes/users');
var migrate = require('./migrate');

var env    = process.env.NODE_ENV || 'development',
    config = require(__dirname + '/config/config')[env];

app.use(serve('./docs'));

app
  .use(web.routes())
  .use(web.allowedMethods())
  .use(users.routes())
  .use(users.allowedMethods());
migrate(function () {
  app.listen(process.env.PORT || config.server.port);
});
