#! /usr/bin/env node

var request = require('request')
var express = require('express')
var xml2js = require('xml2js')
var coberturaPath = '/jenkins/cobertura/'
var jacocoPath = '/jenkins/jacoco/'
var credentials = { user: 'jenkins-api-user', password: 'jenkins-api-token' }

var app = express()
var badgeColor = function(cov) {
	if (cov < 20) {
		return 'red'
	} else if (cov < 80) {
		return 'yellow'
	} else {
		return 'brightgreen'
	}
}
var getBadgeUrl = function(req, label, color) {
	var badgeUrl = 'https://img.shields.io/badge/coverage-' + label + '-' + color + '.svg'
	if (req.query.style) {
		badgeUrl += '?style=' + req.query.style
	}
	console.log('[INFO]  Generating badge: ' + badgeUrl)
	return badgeUrl
}
var redirect = function(res, url) {
	res.setHeader('Expires', 'Tue, 15 Apr 1980 12:00:00 GMT')
	res.setHeader('Cache-Control', 'no-cache')
	res.redirect(url)
}

//cobertura
var handleCobertura = function(protocol,req,res) {
	var jurl = req.params[0]
	var options = { url: protocol + '://' + jurl + '/lastSuccessfulBuild/cobertura/api/json/?depth=2', auth: credentials } 
	console.log('[GET]   ' + coberturaPath + jurl)
	console.log('[API]   ' + options.url)

	request(options, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var elements = JSON.parse(body)['results']['elements']
			for (var i in elements) {
				if (elements[i]['name'] == 'Lines') {
					var cov = elements[i]['ratio'].toFixed(2)
					redirect(res, getBadgeUrl(req, cov.toString() + '%', badgeColor(cov)))
				}
			}
		} else {
			console.log('[ERROR] ' + err)
			redirect(res, getBadgeUrl(req, 'none', 'lightgrey'))
		}
	})
}

app.get(coberturaPath + 'https/*', function(req,res) { handleCobertura('https',req,res); })
app.get(coberturaPath + 'http/*', function(req,res) { handleCobertura('http',req,res); })
app.get(coberturaPath + '*', function(req,res) { handleCobertura('http',req,res); })

//jacoco
var handleJacoco = function(protocol,req,res) {
	var jurl = req.params[0]
	var options = { url: protocol + '://' + jurl + '/lastSuccessfulBuild/jacoco/api/xml', auth: credentials }
	console.log('[GET]   ' + jacocoPath + jurl)
	console.log('[API]   ' + options.url)

	request(options, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var xmlParser = new xml2js.Parser();
			xmlParser.parseString(body, function (err, result) {
				var cov = parseFloat(result.coverageReport.lineCoverage[0].percentageFloat[0]).toFixed(2);
				redirect(res, getBadgeUrl(req, cov.toString() + '%', badgeColor(cov)))	
			})
		} else {
			console.log('[ERROR] ' + err)
			redirect(res, getBadgeUrl(req, 'none', 'lightgrey'))
		}
	})
}

app.get(jacocoPath + 'https/*', function(req,res) { handleJacoco('https',req,res); })
app.get(jacocoPath + 'http/*', function(req,res) { handleJacoco('http',req,res); })
app.get(jacocoPath + '*', function(req,res) { handleJacoco('http',req,res); })

var port = process.argv.slice(2)[0];
if (!port) port = 9913
var server = app.listen(port, function() {
  console.log('Listening on port %d...', server.address().port)
})
