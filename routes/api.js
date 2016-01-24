/**
 * Created by Thram on 24/01/16.
 */
var router = require('koa-router')();
var user   = require('../models').User;

/**
 * @api {get} / Request Home Page
 * @apiName HomePage
 * @apiGroup Web
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */
router.get('/users', function *(next) {
  this.body = user.findAll({});
});

module.exports = router;