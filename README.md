# image-sprites

image sprites

## Usage

This package provides both interfaces of CLI and JavaScript API.

## CLI

```
$ npm install -g image-sprites

$ image-sprites

Usage: image-sprites [options] <args ...>

Options:

  -h, --help        output usage information
  -V, --version     output the version number
  -v, --verbose     output verbose messages
  -f, --foo         option foo without arguments
  -b, --bar <arg>   option bar with an argument
```

## JavaScript API

### Installation

```sh
npm install image-sprites
```

### Callback Style

```javascript
var imagesprites = require("image-sprites");

var opts = {};
var input = "...";

imagesprites(opts).fromCSS(input, function(err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log(res);
  }
});
```

### Event Style

```javascript
  var imagesprites = require("image-sprites");

  var opts = {};
  var input = "...";

  var sprites = new imagesprites(opts)
  .on("fromCSS", function(res) {
    console.log(res);
  })
  .on("error", function(err) {
    console.error(err);
  })
  .on("progress", function(info) {
    console.log(info);
  })
  .fromCSS(input);
```

## Author

@kawanet

## Licence

Copyright 2013 @kawanet

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
