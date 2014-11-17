#!/usr/bin/env node

var fs = require('fs')
  , path = require('path')
  , program = require('commander')
  , colors = require('colors')
  , inquirer = require('inquirer')
  , childProcess = require('child_process')
  , watch = require('node-watch');

var kbbLess = module.exports;

kbbLess.livereload = function(path) {
  var live;

  if (process.platform === 'win32') {
    var cmdLive = 'livereload ' + path + '\\css -i 100';
  } else {
    var cmdLive = 'livereload ' + path + '/css -i 100';
  }

  live = childProcess.exec(cmdLive, function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    }
  });
};

kbbLess.compileFile = function(file, output) {
  var less;
  var compileFile = file.split('/').slice(-1).pop();
  var fileName = compileFile.split('.less')[0];
  var cmdLess = 'lessc ' + file + ' > ' + output + '/' + fileName + '.css';

  less = childProcess.exec(cmdLess, function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      console.log('Compiled: ' + compileFile + ' ' + (new Date()).toTimeString());
    }
  });
};

kbbLess.pathLoc = function() {
  var file = [{
    type: 'input',
    name: 'file',
    message: 'Where is your OOLess folder located?'.yellow
  }];

  inquirer.prompt(file, function(answer) {
    kbbLess.savePath(answer.file);
  });
};

kbbLess.savePath = function(location) {
  var myConfig = {
    path: location,
  };

  var outputFilename = process.cwd() +'/config.json';

  fs.writeFile(outputFilename, JSON.stringify(myConfig, null, 2), function(err) {
    if(!err) {
      kbbLess.watchDir(location);
      kbbLess.livereload(location);
    }
  }); 
};

kbbLess.compileKBB = function() {

  var promptFile,
      promptSave;

  var choose = [{
    type: 'list',
    name: 'ui',
    message: 'Do you want to compile KBB OOLess?'.yellow,
    choices: [
      'yes',
      'no'
    ]
  }];

  inquirer.prompt( choose, function(answer) {
    switch (answer.ui) {
      case 'yes':

        fs.readFile(process.cwd() + '/config.json', 'utf8', function (err, data) {
          if (err) {
            kbbLess.pathLoc();
          } else {
            var config = require(process.cwd() + '/config');
            kbbLess.watchDir(config.path);
            kbbLess.livereload(config.path);
          }
        });

        break;
      case 'no':
          console.log("(╥_╥) Sorry you're on your own".cyan);
          console.log();
        break;
    }
  });

};

kbbLess.watchDir = function(path) {
  fs.readdir(path, function(err, files) {
    if (err === null) {
      var bootstrap = path + '/bootstrap' || path + '\\bootstrap';
      var common = path + '/common' || path + '\\common';
      var desktop = path + '/desktop' || path + '\\desktop';
      var smartphone = path + '/smartphone' || path + '\\smartphone';
      var tablet = path + '/tablet' || path + '\\tablet';

      console.log('(O_O) Watching over your OOLess files'.cyan);
      console.log();

      watch([bootstrap, common, desktop, smartphone, tablet], function(file) {
        kbbLess.compileDir(file, path);
      });
    } else {
      console.log("'".red + path.red + "'".red + " directory doesn't exists".red);
      kbbLess.pathLoc();
    }
  });
};

kbbLess.compileDir = function(file, path) {
  var less;
  var isBootstrap = file.indexOf('OOLess/bootstrap') > -1 || file.indexOf('OOLess\\bootstrap') > -1;
  var isCommon = file.indexOf('OOLess/common') > -1 || file.indexOf('OOLess\\common') > -1;
  var isDesktop = file.indexOf('OOLess/desktop') > -1 || file.indexOf('OOLess\\desktop') > -1;
  var isSmartphone = file.indexOf('OOLess/smartphone') > -1 || file.indexOf('OOLess\\smartphone') > -1;
  var isTablet = file.indexOf('OOLess/tablet') > -1 || file.indexOf('OOLess\\tablet') > -1;
  var compileFile = file.split('/').slice(-1).pop();
  var fileName = compileFile.split('.less')[0];
  var lessifyDesktop = 'lessc ' + path + '/desktop/desktop.less > ' + path + '/css/desktop.css';
  var lessifySmartphone = 'lessc ' + path + '/smartphone/smartphone.less > ' + path + '/css/smartphone.css';
  var lessifyTablet = 'lessc ' + path + '/tablet/tablet.less > ' + path + '/css/tablet.css';
  var lessifyAll = 'lessc ' + path + '/desktop/desktop.less > ' + path + '/css/desktop.css' + ' && ' + 'lessc ' + path + '/smartphone/smartphone.less > ' + path + '/css/smartphone.css' + ' && ' + 'lessc ' + path + '/tablet/tablet.less > ' + path + '/css/tablet.css';

  if (isDesktop) {
    less = childProcess.exec(lessifyDesktop, function (err, stdout, stderr) {
      if (err) {
        console.log(stderr);
      } else {
        console.log('Compiled:' + ' desktop.less '.green + (new Date()).toTimeString().green);
      }
    });
  }

  if (isSmartphone) {
    less = childProcess.exec(lessifySmartphone, function (err, stdout, stderr) {
      if (err) {
        console.log(stderr);
      } else {
        console.log('Compiled:' + ' smartphone.less '.green + (new Date()).toTimeString().green);
      }
    });
  }

  if (isTablet) {
    less = childProcess.exec(lessifyTablet, function (err, stdout, stderr) {
      if (err) {
        console.log(stderr);
      } else {
        console.log('Compiled:' + ' tablet.less '.green + (new Date()).toTimeString().green);
      }
    });
  }

  if (isBootstrap || isCommon) {
    less = childProcess.exec(lessifyAll, function (err, stdout, stderr) {
      if (err) {
        console.log(stderr);
      } else {
        console.log('Compiled:' + ' all three less '.green + (new Date()).toTimeString().green);
      }
    });
  }

};

kbbLess.setupKBB = function() {
  var setup;
  var cmdSetup = 'npm i -g less && npm i -g livereload';

  setup = childProcess.exec(cmdSetup, function (err, stdout, stderr) {
    if (err) {
      console.log(stderr);
    } else {
      console.log('setup was successfully!'.green);
    }
  });
};

program
  .version('0.0.2')
  .usage('less')
  .option('-f, --file [less]', 'Single file to watch/compile')
  .option('-o, --output [path]', 'Output path for single compile less')

program
  .command('less')
  .description('watch/compile KBB OOLess')
  .action(function() {
    kbbLess.compileKBB();
  });

program
  .command('setup')
  .description('install the necessary file dependencies')
  .action(function() {
    kbbLess.setupKBB();
  });

program.parse(process.argv);

var file = program.file || null,
    directory = program.directory || null,
    output = program.output || null;

if (file !== null) {
  kbbLess.compileFile(file, output);
}