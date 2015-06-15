#! /usr/bin/env node

var request = require('request')
var express = require('express')

var app = express()

app.get('/jenkins/c/http/*', function(req,res) {
  var jurl = req.params[0]
  var url = 'http://' + jurl + '/lastSuccessfulBuild/cobertura/api/json/?depth=2'
  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var elements = JSON.parse(body)['results']['elements']
      for (var i in elements) {
        if (elements[i]['name'] == 'Lines') {
          var cov = elements[i]['ratio'].toFixed(2)
          var color = function(cov) {
            if (cov < 20) {
              return 'red'
            } else if (cov < 80) {
              return 'yellow'
            } else {
              return 'brightgreen'
            }
          }(cov)
          var badge_url = 'https://img.shields.io/badge/coverage-' + cov.toString() + '%-' + color + '.svg'
          var style = req.param("style")
          if (typeof style != 'undefined') {
            badge_url += '?style=' + style
          }
          console.log('[GET] ' + '/jenkins/c/http/' + jurl)
          console.log('      generating badge(' + badge_url + ')')
          res.redirect(badge_url)
        }
      }
    } else {
      console.log(err)
      var badge_url = 'https://img.shields.io/badge/coverage-none-lightgrey.svg'
      console.log('[GET] ' + '/jenkins/c/http/' + jurl)
      console.log('      generating badge(' + badge_url + ')')
      res.redirect(badge_url)
    }
  })
})

var port = process.argv.slice(2)[0];
if (!port) port = 9913
  var server = app.listen(port, function() {
    console.log('Listening on port %d...', server.address().port)
  })
