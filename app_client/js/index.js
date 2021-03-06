const express = require('express');
var router = express.Router();
var shell = require('shelljs');
var randomstring = require("randomstring");
var fs = require('fs');
var path = require('path');
var imagesDirectory = path.join('"' + __dirname + '"', '../../docker_images/docker-qgis-model/workspace/example');

router.post('/odm', function (req, res) {
  res.send("Under construction!");
});

router.post('/ndvi', function (req, res) {
  console.log("one");
  var data = req.body;
  console.log(data.path);
  console.log(data.output);
  shell.exec('cp ' + data.path + " " + imagesDirectory, function (code, stdout, stderr) {
    if (stderr) {
      res.status(500).send(stderr);
    } else {
      //navigating to the folder to execute the next steps there
      shell.cd('docker_images/docker-qgis-model/workspace/example');
      console.log("two");
      if (!stderr) {
        console.log("three");
        var filename = data.path.replace(/^.*[\\\/]/, '');
        //rename the image
        shell.exec('mv ' + filename + " orthophoto.tif", function (code, stdout, stderr) {
          if (!stderr) {
            console.log("four");
            //do the computations
            var randomqgis;
            randomqgis = randomstring.generate(7);
            //run a build a qgis docker image
            shell.exec('docker build -t qgis-model-example .', function (code, stdout, stderr) {
              if (!stderr) {
                console.log("five");
                //run a docker qgis ndvi image                
                shell.exec('docker run --name ' + randomqgis + ' qgis-model-example', function (code, stdout, stderr) {
                  if (stdout || code == 0) {
                    console.log("six");
                    //copy the files to a local directory
                    shell.exec('docker cp ' + randomqgis + ':/results ' + data.output, function (code, stdout, stderr) {
                      console.log("seven");

                      shell.exec('rm orthophoto.tif', function (code, stdout, stderr) {
                        console.log("seven and half");
                      });

                      shell.exec('docker rm ' + randomqgis, function (code, stdout, stderr) {
                        console.log("eight");
                        res.send("NDVI Berechnung abgeschlossen!");
                      });
                    });
                  } else if (stderr) {
                    console.log('Program stderr:', stderr);
                    res.status(500).send(stderr);
                  }
                });
              } else {
                res.status(500).send(stderr);
              }
            });
          } else {
            res.status(500).send(stderr);
          }
        });
      } else {
        res.status(500).send(stderr);
      }
    }
  });;
});

router.post('/las', function (req, res) {
  res.send("Under construction!");
});

router.post('/tiles', function (req, res) {
  var data = req.body;
  console.log(data.path);
  console.log(data.output);

  res.send("Under construction!");
});

module.exports = router;