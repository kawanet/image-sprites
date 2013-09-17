/*! sprites.js */

var parse = require("css-parse");
var cssrule = require("./cssrule");
var Sprite = require("./sprite");

module.exports = Sprites;

function Sprites(opts) {
    this.opts = opts || {};
    this.list = [];
}

var csspopts = {
    position: false
};

Sprites.fromCSS = function (source, opts) {
    var ret = parse(source, csspopts);
    var selectors = {};
    var classPrefix = {};

    ret.stylesheet.rules.forEach(function (parsed) {
        if (parsed.type != "rule") return;
        if (!parsed.selectors) return;
        var rule = new cssrule(parsed);

        var image = rule.backgroundImage();
        var posx = -rule.backgroundPositionX();
        var posy = -rule.backgroundPositionY();
        var width = rule.width();
        var height = rule.height();

        parsed.selectors.forEach(function (selector) {
            var sprite = selectors[selector];
            if (!sprite) {
                var arg = rule.declarations();
                arg.selector = selector;
                sprite = selectors[selector] = new Sprite(arg, opts);
            }

            if (image) sprite.arg.url = image;
            if (!isNaN(posx)) sprite.x = posx;
            if (!isNaN(posy)) sprite.y = posy;
            if (!isNaN(width)) sprite.w = width;
            if (!isNaN(height)) sprite.h = height;

            // allow [class^="icon-"]
            if (selector.search(/^\[class\^\=".*"\]/) == 0) {
                var className = selector.split(/"/)[1];
                classPrefix[className] = sprite;
            }
        });
    });

    var sprites = new Sprites(opts);

    Object.keys(selectors).map(function (selector) {
        var sprite = selectors[selector];
        if (selector.search(/^\.[\w\-]+$/) == 0) {
            for (var prefix in classPrefix) {
                if (selector.substr(1, prefix.length) != prefix) continue;
                var ref = classPrefix[prefix];
                if (ref.arg.url && !sprite.arg.url) sprite.arg.url = ref.arg.url;
                if (!isNaN(ref.x) && isNaN(sprite.x)) sprite.x = ref.x;
                if (!isNaN(ref.y) && isNaN(sprite.y)) sprite.y = ref.y;
                if (!isNaN(ref.w) && isNaN(sprite.w)) sprite.w = ref.w;
                if (!isNaN(ref.h) && isNaN(sprite.h)) sprite.h = ref.h;
            }
        }
        return sprite;
    }).filter(function (sprite) {
            return sprite.hasPosition();
        }).forEach(function (sprite) {
            sprites.addSprite(sprite);
        });

    return sprites;
};

Sprites.prototype.addSprite = function (sprite) {
    this.list.push(sprite);
};

Sprites.prototype.toJSON = function () {
    var out = {};
    var sprites = {};
    this.list.forEach(function (sprite) {
        var name = sprite.name();
        sprites[name] = sprite.toJSON();
    });
    out.sprites = sprites;
    return out;
};

Sprites.prototype.toString = function () {
    var out = [];
    this.list.forEach(function (sprite) {
        var line = sprite.toString();
        var name = sprite.name();
        name = JSON.stringify(name);
        out.push(' ' + name + ': ' + line);
    });
    return "{\n" + out.join(",\n") + "\n}\n";
};

Sprites.prototype.toCSS = function () {
    var out = [];
    this.list.forEach(function (sprite) {
        var line = sprite.toCSS();
        out.push(line);
    });
    return out.join("\n");
};

Sprites.prototype.toMap = function () {
    var out = [];
    var name = this.name() || 'undefined';
    out.push('<map name="' + name + '">');
    this.list.forEach(function (sprite) {
        var line = sprite.toMap();
        out.push(' ' + line);
    });
    out.push('</map>');
    return out.join("\n");
};

Sprites.prototype.name = function (name) {
    if (name != null) {
        this._name = name;
    } else if (this._name != null) {
        name = this._name;
    } else {
        this.list.forEach(function (sprite) {
            if (!name && sprite.arg.src) {
                name = sprite.arg.src;
            }
        });
        if (name) {
            name = name.replace(/^.*\//, '').replace(/[?\.#].*$/, '');
            this._name = name;
        }
    }
    return name;
};
