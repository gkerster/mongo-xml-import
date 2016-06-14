var async = require('async')
var fs = require('fs');
var xml2js = require('xml2js');
var processors = require('xml2js/lib/processors');
var path = require("path");
var recursive = require('recursive-readdir');

var argv = require('minimist')(process.argv.slice(2));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/' + argv.d);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var XMLSchema = new Schema({
    data: Schema.Types.Mixed
});
var XMLSchema_Model = mongoose.model(argv.c, XMLSchema);

var fileDir = path.resolve(argv.f)

var cnt=0;

try {
    recursive(fileDir, argv.i.split(','), function (err, files) {
        if(err) throw err;     
        async.eachSeries(files, function iteratee(item, callback) {
            console.log(((cnt++/files.length)*100).toFixed(2) +' - ' + item);
            var fileData = fs.readFileSync(item).toString();
            var parser = new xml2js.Parser({ignoreAttrs: true, explicitArray: false, trim: true, tagNameProcessors: [processTagName], valueProcessors: [processors.stripPrefix, processors.parseBooleans, processors.parseNumbers]});
            parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
                    var xmlSchemaModel = new XMLSchema_Model();
                    if (result) 
                        xmlSchemaModel.data = result;
                    else 
                        xmlSchemaModel.data = {};
                    xmlSchemaModel.save(function (err) {
                        if (err) console.log(err);
                        console.log("File '" + item + " was successfully read.\n");
                        callback();
                    });
            });
        }, function done() {
            console.log('DONE')
        });
    });
} catch (ex) {console.log(ex)}

function processTagName(name) {
    name = name.replace(/\./g,"_")
    if (name.split(":").length == 2) {
        name = name.split(":")[1]
    }
    return name;
}
