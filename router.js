/**
 * Created by Thram on 24/01/16.
 */
var router = require('koa-router')();

var api = require('./routes/api');

router.use('/api', api.routes(), api.allowedMethods());
module.exports = router;