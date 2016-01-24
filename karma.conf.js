/**
 * Created by Thram on 24/01/16.
 */
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    reporters : ['spec'],
    browsers  : ['PhantomJS'],
    files     : [
      'tests/**/*.js'
    ]
  });
};