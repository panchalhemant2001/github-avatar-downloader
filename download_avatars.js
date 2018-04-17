var request = require('request');
var ght = require("./secrets.js");

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'user-agent': 'request',
     'Authorization': `token ${ght.GITHUB_TOKEN}`
    }


  };


  request(options, function(err, res, body) {
    cb(err, body);
  });
}



getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});



/*
curl -i -H 'Authorization: token 9f4c611902ab705a7acf58dfd7d1e8dd1fa611c9' https://api.github.com/repos/jquery/jquery/contributors
*/