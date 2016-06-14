# mongo-xml-load

Quick and dirty xml bulk load utility for MongoDB.

```
USAGE:
    node server [ARGS] [OPTIONS]

ARGS:
    -d  MongoDB Database
    -c  MongoDB Collection
    -f  Path to folder containing XML files
    
OPTIONS:
    -i  List of files to ignore
```

### Example Usage

Basic
```
node server -d DB_NAME -c COLLECTION_NAME -f ../XMLFiles/
```

Ignorning specific files
```
node server -d DB_NAME -c COLLECTION_NAME -f ../XMLFiles/ -i *.parcel,.DS_Store,*.txt,*.tsv
```
