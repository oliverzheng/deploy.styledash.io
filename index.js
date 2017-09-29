var URL = require('url').URL;
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));

// If the deployment process takes more than 5 minutes that'd be sad :(
var SCHEMA_DEPLOY_TIMEOUT = 5 * 60 * 1000;
var schemaCommit = null;

function setSchemaCommit(commitHash) {
  schemaCommit = commitHash;
  setTimeout(resetSchemaCommit, SCHEMA_DEPLOY_TIMEOUT);
}
function resetSchemaCommit() {
  schemaCommit = null;
}

app.post('/schema/setDeployCommit', function(req, res) {
  var commitHash = req.body.commitHash;
  setSchemaCommit(commitHash);
  res.send();
});
app.post('/schema/getAndResetDeployCommit', function(req, res) {
  var hash = schemaCommit;
  resetSchemaCommit();
  res.send(hash);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
