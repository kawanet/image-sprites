# image-sprites

```javascript
var fs = require("fs");
var Sprites = require("image-sprites");

var css = fs.readFileSync("src.css", "utf8");
var sprites = Sprites.fromCSS(css);

fs.writeFileSync("out.css", sprites.toCSS());
fs.writeFileSync("out.html", sprites.toMap());
fs.writeFileSync("out.json", sprites.toString());
```
