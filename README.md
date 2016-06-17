# mongo-xml-import

Quick and dirty command-line XML bulk load utility for MongoDB. Uses [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js), [mongoose](http://mongoosejs.com/), [yargs](https://github.com/yargs/yargs), and [recursive-readdir](https://github.com/jergason/recursive-readdir).

```
Usage: importxml <cmd> [options]

Commands:
  start [options]  import xml file(s)
  schema [options]  create mongodb collection based on specified xsd

Options:
  -d, --db          mongodb database  [string]
  -c, --collection  mongodb collection | collection for xsd  [string]
  -f, --folder      path to the folder that contains the xml files  [string]
  -i, --ignore      list XML files that should not be imported  [string]
  -D, --drop        drop collection prior to import  [boolean] [default: false]
  -H, --host        mongodb host  [string] [default: "localhost"]
  -p, --port        mongodb port  [string] [default: "27017"]
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

(MIT)

Copyright (c) 2016 Graham Kerster <gkerster@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
