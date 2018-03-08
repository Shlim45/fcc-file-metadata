var express = require('express');
var multer = require('multer');
var cors = require('cors');

var storage = multer.memoryStorage();

var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// upload to memory and limit file size to 100MB
app.post('/', function (req, res) {
  const maxFileSize = 104857600;
  const upload = multer({ storage, limits: { fileSize: maxFileSize } }).single('myFile');
  
  function convertToMB(bytes) {
    return Math.round(bytes/(1024 * 1024));
  }
  
  upload(req, res, function (err) {
    if (err) {  // file size too large      convert from bytes to megabytes
      const error = `file size over ${convertToMB(maxFileSize)}MB`;
      res.json({ error });
      console.error(err);
      return;
    }
    if (!req.file) { // blank form submitted
      res.redirect('/');
      return;
    }
    const { size } = req.file;
    res.json({size}); 
  })
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
