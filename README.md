# mongo-xml-import

Quick and dirty command-line XML bulk load utility for MongoDB. Uses [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js), [mongoose](http://mongoosejs.com/), [yargs](https://github.com/yargs/yargs), and [recursive-readdir](https://github.com/jergason/recursive-readdir).

```
Usage: importxml <cmd> [options]

Commands:
  start [options]  import xml file(s)
  model [options]  create mongodb collection based on specified xsd

Options:
  -d, --db          mongodb database  [string]
  -c, --collection  mongodb collection  [string]
  -f, --folder      path to the folder that contains the xml files  [string]
  -i, --ignore      list XML files that should not be imported  [string]
  -D, --drop        drop collection prior to import  [boolean] [default: false]
  -H, --host        mongodb host  [string] [default: "localhost"]
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]
```

### usage

Basic   
```
$ importxml -d DB_NAME -c COLLECTION_NAME -f ../XMLFiles/
$ importxml --db DB_NAME --collection COLLECTION_NAME --folder ../XMLFiles/
```

Ignorning specific files
```
$ importxml -d DB_NAME -c COLLECTION_NAME -f ../XMLFiles/ -i *.TCGA-A8-A0A1.xml,*_TEMP.xml
$ importxml --db DB_NAME --collection COLLECTION_NAME --folder ../XMLFiles/ --ignore *.TCGA-A8-A0A1.xml,*_TEMP.xml
```

### example
![Example](https://github.com/gkerster/mongo-xml-import/blob/master/example/example_output.png)

### license

MIT
