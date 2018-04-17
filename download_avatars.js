var request = require('request');
var fs = require('fs');
var ght = require("./secrets.js");

var filepath = "./avatars";

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



/*function createDirectoryIfNotExist(dirName) {
  //Checking if directory avatars exists or not
  //If not, it is created
  fs.exists(dirName , (exists) => {
    if(exists === true) {
      //console.log("Directory already exists");
    } else {
      fs.mkdir(dirName, (err) => {
        if(err) {
          console.log("Error: Directory " + dirName + " not created");
        }
      })
    }
  });
}
*/

//Function to download an image from url specified and store into the path specified by filepath
function downloadImageByURL(url, filepath) {
  //creating directory (filepath) if not exists
  //createDirectoryIfNotExist(filepath);

  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .on('response', function(response){
    console.log('Response Status Code: ', response.statusCode);
    console.log('Response Message: ', response.statusMessage);
    console.log('Content-Type: ', response.headers['content-type']);
    console.log('Downloading image...');
  })
  .on('end', function() {
    console.log("Download complete.");
  })

  .pipe(fs.createWriteStream(filepath));
}


//calling getRepoContributors() function
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);

  var contributorArrObj = JSON.parse(result);

  var fileNo = 1;   //file names are given as sequential number.jpg
  //getting URL path for each avatar_url and downloading to a specific folder
  for(var elementObj of contributorArrObj) {
    //console.log(elementObj["avatar_url"]);

    var url = elementObj["avatar_url"];
    downloadImageByURL(url, filepath + "/" + fileNo);

    fileNo++;
  }
});