#! /usr/bin/env node

var colors = require('colors/safe');
var async = require('async')
var fs = require('fs');
var xml2js = require('xml2js');
var processors = require('xml2js/lib/processors');
var path = require("path");
var recursive = require('recursive-readdir');
var ProgressBar = require('progress');

var program = require('commander');

program
    .version('0.1.0')
    .description('Quick and dirty xml bulk load utility for MongoDB.')
    .arguments('<db> <collection> <folder>')
    .option('-d, --db <db>', 'Specify MongoDB Database')
    .option('-c, --collection <collection>', 'Sepcify MongoDB Collection')
    .option('-f, --folder <folder>', 'Specify the path to the folder that contains the XML files')
    .option('-i, --ignore [ignore]', 'List XML files that should not be imported')
    .parse(process.argv);

checkRequiredArgs(function(msg){
    if (msg) {
        for (var i=0; i<msg.length; i++) {
            console.log(msg[i]);
        }
        process.exit(1)
    } else {
        startImportProcess();
    }
});

function checkRequiredArgs(callback) {
    var missingArgMsgs = [];
    if (!process.argv.slice(2).length) {
        program.help(make_red);
        process.exit(1);
    }
    if (!program.db) {
        missingArgMsgs.push(make_red('  error: you must specify a mongodb database using options: -d, --db'));
    }
    if (!program.collection) {
        missingArgMsgs.push(make_red('  error: you must specify a mongodb collection using options: -c, --collection'));
    }
    if (!program.folder) {
        missingArgMsgs.push(make_red('  error: you must specify the path to the folder that contains the XML files using options: -f, --folder'));
    }
    callback(missingArgMsgs.length > 0 ? missingArgMsgs : null);
}

function startImportProcess() {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/' + program.db);

    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var XMLSchema = new Schema({
        data: Schema.Types.Mixed
    });

    var XMLSchema_Model = mongoose.model(program.collection, XMLSchema);

    var fileDir = path.resolve(program.folder)
    var green = '\u001b[42m \u001b[0m';

    var results = {
        success: 0,
        error: 0,
        errorList: []
    }
    var ignoreOptions = [ignoreFunc];
    if (program.ignore)
        ignoreOptions = program.ignore.split(',').concat(ignoreOptions);

    var parser = new xml2js.Parser({
            ignoreAttrs: true, 
            explicitArray: false, 
            trim: true, 
            tagNameProcessors: [processTagName], 
            valueProcessors: [processors.stripPrefix, processors.parseBooleans, processors.parseNumbers]
        });

    try {
        recursive(fileDir, ignoreOptions, function (err, files) {
            console.log('\n  ' + files.length + ' XML files found\n')
            var bar = new ProgressBar('  Importing [:bar] :percent  |  Files: :current/:total    ', {
                complete: green
              , incomplete: '_'
              , width: 25
              , total: files.length
              , callback: function() {
                    console.log(colors.green('\n  ' + results.success + ' Files Imported Successfully'))
                    if (results.errorList.length>0) {
                        console.log(colors.red('\n  ' + colors.underline(results.error + ' Error(s) found:\n')));
                        for(var i=0; i<results.errorList.length; i++) {
                            console.log(colors.blue('      File: ') + results.errorList[i].file)
                            console.log(colors.red('       └── ' + JSON.stringify(results.errorList[i].error)))
                        }
                        console.log('\n')
                    }
                    process.exit()
              }
            });

            if(err) throw err;     
            async.eachSeries(files, function iteratee(item, callback) {
                var fileData = fs.readFileSync(item).toString();
                parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
                        if (err) {
                            results.errorList.push({file: item, error: err.toString()})
                            results.error++;
                            bar.tick(1);
                            callback();
                        } else {
                            var xmlSchemaModel = new XMLSchema_Model();
                            xmlSchemaModel.data = result;
                            xmlSchemaModel.save(function (err) {
                                if (err) {
                                    results.error++;
                                } else {
                                    results.success++;
                                }
                                bar.tick(1);
                                callback();
                            });
                        }
                });
                
            }, function done() {

            });
        });
    } catch (ex) {console.log(ex)}

}

function processTagName(name) {
    name = name.replace(/\./g,"_")
    if (name.split(":").length == 2) {
        name = name.split(":")[1]
    }
    return name;
}

function ignoreFunc(file, stats) {
  return !stats.isDirectory() && path.extname(file) != ".xml"
}

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}