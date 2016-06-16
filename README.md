# mongo-xml-import

Quick and dirty command-line XML bulk load utility for MongoDB. Uses [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js), [recursive-readdir](https://github.com/jergason/recursive-readdir), [mongoose](http://mongoosejs.com/), and [minimist](https://github.com/substack/minimist).

```
USAGE:
    importxml [OPTIONS] <db> <collection> <folder>

ARGS:
    -d, --db <db>                   MongoDB Database
    -c, --collection <collection>   MongoDB Collection
    -f, --folder <folder>           Path to folder containing XML files
    
OPTIONS:
    -i, --ignore [ignore]    Comma separated list of files to ignore
    -H, --host [host]        Host to which MongoDB is running, defaults to localhost
    -D, --Drop               Drop collection prior to insert
    -h, --help               Output usage information
    -V, --version            Output the version number
```

### Usage

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

### Example
![Example](https://github.com/gkerster/mongo-xml-import/blob/master/example/example_output.png)
