var request = require("request");
// var application = require('../index.js');
var base_url = "http://localhost:3000/"

describe("DaVinci Node Server", function() {
  describe("GET /", function() {
    it("returns status code 200", function() {
      request.get(base_url, function(error, response, body) {
        console.log("/" + response.statusCode);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("GET /signup", function() {
    it("returns status code 200", function() {
      var url = base_url + "#/signup";
      request.get(url, function(error, response, body) {
        console.log("signup " + response.statusCode);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("GET /managerDashboard", function() {
    it("returns status code 200", function() {
      var url = base_url + "#/managerDashboard";
      request.get(url, function(error, response, body) {
        console.log("managerDashboard " + response.statusCode);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("GET /adminDashboard", function() {
    it("returns status code 200", function() {
      var url = base_url + "#/adminDashboard";
      request.get(url, function(error, response, body) {
        console.log("adminDashboard " + response.statusCode);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("GET /vote_confirmed", function() {
    it("returns status code 200", function() {
      var url = base_url + "#/vote_confirmed";
      request.get(url, function(error, response, body) {
        console.log("vote_confirmed " + response.statusCode);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("GET /voterDashboard", function() {
    it("returns status code 200", function() {
      var url = base_url + "#/voterDashboard";
      request.get(url, function(error, response, body) {
        console.log("voterDashboard " + response.statusCode);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("GET /voting", function() {
    it("returns status code 200", function() {
      var url = base_url + "#/voting";
      request.get(url, function(error, response, body) {
        console.log("voting " + response.statusCode);
        expect(response.statusCode).toBe(200);
      });
    });
  });

  describe("GET /404", function() {
    it("returns status code 404", function() {
      var url = base_url + "nothing";
      request.get(url, function(error, response, body) {
        console.log("bad page " + response.statusCode);
        expect(response.statusCode).toBe(404);
        // sleep(500);
      });
    });
  });
});
