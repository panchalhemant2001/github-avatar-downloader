var request = require('request');
var fs = require('fs');
var ght = require("./secrets.js");

var filepath = "./avatars";
var repName = "jquery";   //default repository name for demo purpose
var ownerName ="jquery";  //default owner name for demo purpose


console.log('Welcome to the GitHub Avatar Downloader!');




//Getting repository name and owner name from command line arguments
//Getting parameters values
var args = process.argv.slice(2);
//console.log("Length : " + args.length);

if(args.length <=1) {
  console.log("Please specify guthub repository name and owner name...");
  console.log("Program now will run for default repository and owner names (jquery, jquery)....");
} else {
  repName = args[0];
  ownerName = args[1];

  console.log(repName, ownerName);
}






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
//Passing the repository name and owner name from command line arguments or default (jquery, jquery)
getRepoContributors(repName, ownerName, function(err, result) {
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