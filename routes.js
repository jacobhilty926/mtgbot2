//
// This defines three routes that our API is going to use.
//
var fetch = require("node-fetch");
var stringify = require('json-stringify');
var handlers = require("./handlers.js");
  
var routes = app => {
  // Handle posts from slack
  app.post("/api", function(req, res) {
    console.log('got api request')
    const body = req.body
    // Compare tokens
    if (body.type === "url_verification") {
      return res.send(handlers.handle_url_verification(body))
    } else {
      return res.send(handlers.handle_event_callback(body))
    }
    console.log(body)
    return res.send("unknown event type")
  });
};
 
module.exports = routes;