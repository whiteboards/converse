var express = require('express')
var sass = require('node-sass-middleware')
var path = require('path')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose')

var routes = require('./routes/')

mongoose.connect('mongodb://' + (process.env.IP || 'localhost') + '/data')
console.log('[mongodb] connected to mongodb://' + (process.env.IP || 'localhost') + '/data')

var app = express()

// Configure sass

app.use(
  sass({
    root: __dirname,
    indentedSyntax: true,
    src: '/sass',
    dest: '/public/css',
    prefix: '/css',
    debug: true
  })
)

// Set static directory to /public
app.use(express.static(path.join(__dirname, 'public')))

// Set Jade as the view engine
app.set('view engine', 'jade')

// Set ip and port for server
app.set('port', process.env.PORT || 3000)
app.set('ip', process.env.IP || '0.0.0.0')

// Configure cookie-parser
app.use(cookieParser('This is a supery-dupery-doo secret that is secrety'))

// Site-wide variables
app.locals.sitename = 'Converse'
app.locals.slogan = "Because social shouldn't involve shouting"

app.use(routes)

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).sendFile(__dirname + '/views/error.html')
})

// Run the server
var server = app.listen(app.get('port'), app.get('ip'), function () {
  var address = server.address()
  console.log('[converse] app listening on https://%s:%s', address.address, address.port)
})
