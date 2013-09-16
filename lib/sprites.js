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
        });
    });

    var sprites = new Sprites(opts);
    for (var selector in selectors) {
        var sprite = selectors[selector];
        if (sprite.hasPosition()) {
            sprites.addSprite(sprite);
        }
    }

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
    out.push('{');
    this.list.forEach(function (sprite) {
        var line = sprite.toString();
        var name = sprite.name();
        out.push(' "' + name + '": ' + line);
    });
    out.push('}');
    return out.join("\n");
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
