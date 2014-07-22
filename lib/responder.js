var Responder = function() {

  this.error = function(res, msg) {
    return res.json({
      "status": "error",
      "message": msg
    });
  }

  return function(req, res, options) {
    var template = options.template;
    var error = options.error;
    var data = options.data || {};
    var jsonRes = {};
    jsonRes['data'] = data;
    if(error) {
      jsonRes['status'] = 500,
      jsonRes['error'] = error;
    } else {
      jsonRes['status'] = 200;
    }
    if(template) {
      res.render(template, jsonRes);
    } else {
      res.json(jsonRes);
    }
  }

};

module.exports = new Responder();
