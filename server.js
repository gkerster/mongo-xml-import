#! /usr/bin/env node

var colors = require('colors/safe');
var async = require('async')
var fs = require('fs');
var xml2js = require('xml2js');
var processors = require('xml2js/lib/processors');
var path = require("path");
var recursive = require('recursive-readdir');
var ProgressBar = require('progress');

var argv = require('yargs')
  .usage('Usage: $0 <cmd> [options]') 
    .option('d', { 
        description: 'mongodb database',
        alias: 'db',
        type: 'string',
        requiresArg: true
      })
      .option('c', { 
        description: 'mongodb collection',
        alias: 'collection',
        type: 'string',
        requiresArg: true
      })
      .option('f', { 
        description: 'path to the folder that contains the xml files',
        alias: 'folder',
        type: 'string',
        requiresArg: true
      })
      .option('i', { 
        description: 'list XML files that should not be imported',
        alias: 'ignore',
        type: 'string',
        requiresArg: true
      })
      .option('D', {
        description: 'drop collection prior to import',
        alias: 'drop',
        type: 'boolean',
        default: false
      })
      .option('H', {
        description: 'mongodb host',
        alias: 'host',
        type: 'string',
        default: 'localhost'
      })
      .option('p', {
        description: 'mongodb port',
        alias: 'port',
        required: false,
        type: 'string',
        default: '27017'
      })
  .command(
    'start [options]',
    'import xml file(s)',
    function (yargs) {
      return yargs
      .usage('Usage: $0 [options]')
      .option('d', { 
        description: 'mongodb database',
        alias: 'db',
        required: true,
        type: 'string',
        requiresArg: true
      })
      .option('c', { 
        description: 'mongodb collection',
        alias: 'collection',
        required: true,
        type: 'string',
        requiresArg: true
      })
      .option('f', { 
        description: 'path to the folder that contains the xml files',
        alias: 'folder',
        required: true,
        type: 'string',
        requiresArg: true
      })
      .option('i', { 
        description: 'list XML files that should not be imported',
        alias: 'ignore',
        required: false,
        type: 'string',
        requiresArg: true
      })
      .option('D', {
        description: 'drop collection prior to import',
        alias: 'drop',
        required: false,
        type: 'boolean'
      })
      .option('H', {
        description: 'mongodb host',
        alias: 'host',
        required: false,
        type: 'string',
        default: 'localhost'
      })
      .option('p', {
        description: 'mongodb port',
        alias: 'port',
        required: false,
        type: 'string',
        default: '27017'
      })
    },
    function (argv) {
      startImportProcess(argv);
    }
  )
  .command(
    'schema [options]',
    'create mongodb collection based on specified xsd',
    function (yargs) {
      return yargs.option('d', { 
        description: 'mongodb database',
        alias: 'db',
        required: true,
        type: 'string',
        requiresArg: true
      })
      .option('c', { 
        description: 'mongodb collection name for xsd model',
        alias: 'collection',
        required: true,
        type: 'string',
        requiresArg: true
      }).option('x', { 
        description: 'path to xsd file',
        alias: 'xsd',
        required: true,
        type: 'string',
        requiresArg: true
      })
      .option('H', {
        description: 'mongodb host',
        alias: 'host',
        required: false,
        type: 'string',
        default: 'localhost'
      })
      .option('p', {
        description: 'mongodb port',
        alias: 'port',
        required: false,
        type: 'string',
        default: '27017'
      })
    },
    function (argv) {
      console.log(make_red('\nXSD feature coming soon!\n'))
      process.exit();
    }
  )
  .demand(1, make_red('\nmust provide a valid command\n'))
  .strict()
  .wrap(null)
  .option('h', {
    alias: 'help'
  })
  .option('v', {
    alias: 'version'
  })
  .version()
  .help('help')
  .argv

function startImportProcess(argv) {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://' + argv.host + '/' + argv.db);

    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var XMLSchema = new Schema({
        data: Schema.Types.Mixed
    });

    var XMLSchema_Model = mongoose.model(argv.collection, XMLSchema);

    var fileDir = path.resolve(argv.folder)
    var green = '\u001b[42m \u001b[0m';

    var results = {
        success: 0,
        error: 0,
        errorList: []
    }
    var ignoreOptions = [ignoreFunc];
    if (argv.ignore)
        ignoreOptions = argv.ignore.split(',').concat(ignoreOptions);

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