/**
 * Created by Thram on 24/01/16.
 */
var
  app   = require('koa')(),
  serve = require('koa-static-server');

var router  = require('./router');
var migrate = require('./migrate');

var env    = process.env.NODE_ENV || 'development',
    config = require(__dirname + '/config/config')[env];

app.use(serve({rootDir: 'public'}));
app.use(serve({rootDir: 'docs', rootPath: '/docs'}));

app
  .use(router.routes())
  .use(router.allowedMethods());

migrate(function () {
  app.listen(process.env.PORT || config.server.port);
});