exports.install = function () {
  /**
   * @api {get} / Home View
   * @apiName Home
   * @apiGroup Home
   *
   * @apiSuccess {String} Return HTML.
   */
  F.route('/', view_index);


  /**
   * @api {get} /docs Home View
   * @apiName Docs
   * @apiGroup Docs
   *
   * @apiSuccess {String} Return HTML.
   */
  F.route('/docs', docs_index);
  // or
  // F.route('/');
};

function view_index() {
  var self = this;
  self.view('index');
}

function docs_index() {
  var self = this;
  self.layout('view/docs');
  self.view('index');

}