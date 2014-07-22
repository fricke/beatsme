var Responder = function() {

  return function(res, options) {
    var template = options.template;
    var error = options.error;
    var data = options.data || {};
    var jsonRes = {};
    jsonRes['data'] = data;
    if(error) {
      jsonRes['status'] = 'error';
      jsonRes['statusCode'] = error.statusCode || options.statusCode || 500,
      jsonRes['error'] = error.message || error;
      res.status(jsonRes['statusCode']);
    } else {
      jsonRes['status'] = 'success';
      jsonRes['statusCode'] = 200;
    }

    if(template) {
      res.render(template, jsonRes);
    } else {
      res.json(jsonRes);
    }
  }

};

module.exports = new Responder();
