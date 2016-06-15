# mongo-xml-import

Quick and dirty xml bulk load utility for MongoDB. Uses [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js), [recursive-readdir](https://github.com/jergason/recursive-readdir), [mongoose](http://mongoosejs.com/), and [minimist](https://github.com/substack/minimist).

```
USAGE:
    node server [ARGS] [OPTIONS]

ARGS:
    -d  MongoDB Database
    -c  MongoDB Collection
    -f  Path to folder containing XML files
    
OPTIONS:
    -i  Comma separated list of files to ignore
```

### Usage

Basic
```
node server -d DB_NAME -c COLLECTION_NAME -f ../XMLFiles/
```

Ignorning specific files
```
node server -d DB_NAME -c COLLECTION_NAME -f ../XMLFiles/ -i *.TCGA-A8-A0A1.xml,*_TEMP.xml
```

### Example
![Example](https://github.com/gkerster/mongo-xml-import/blob/master/example/example_output.png)
