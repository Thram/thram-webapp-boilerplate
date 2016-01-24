/**
 * Created by Thram on 24/01/16.
 */
var router = require('koa-router')();

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
router.get('/', function *(next) {
  this.body = 'Hello World';
});

/**
 * @api {get} /doc Request Documentation Page
 * @apiName DocsPage
 * @apiGroup Web
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */
router.get('/docs', function *(next) {
  this.redirect('/docs/index.html');
});

module.exports = router;