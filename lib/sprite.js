/*! sprite.js */

var obop = require("obop");

module.exports = Sprite;

function Sprite(arg, opts) {
    this.arg = arg || {};
    this.opts = opts || {};
}

Sprite.prototype.name = function (name) {
    if (name != null) {
        this._name = name;
    } else if (this._name != null) {
        name = this._name;
    } else if (this.arg.name) {
        this._name = name = this.arg.name;
    } else if (this.arg.selector) {
        name = this.arg.selector.replace(/[^\w]+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
        this._name = name;
    }
    return name;
};

Sprite.prototype.hasPosition = function () {
    return !isNaN(this.x) || !isNaN(this.y);
};

Sprite.prototype.toJSON = function () {
    var c = [];
    if (!isNaN(this.x)) c[0] = this.x;
    if (!isNaN(this.y)) c[1] = this.x;
    if (!isNaN(this.w)) c[2] = this.w;
    if (!isNaN(this.h)) c[3] = this.h;
    if (this.opts.args && !this.opts._args) {
        this.opts._args = obop.view(this.opts.args);
    }
    if (this.opts.args && this.arg) {
        var arg = this.arg;
        if (this.opts._args) {
            arg = this.opts._args(arg);
        }
        if (Object.keys(arg).length) {
            c[4] = arg;
        }
    }
    return c;
};

Sprite.prototype.toString = function () {
    return JSON.stringify(this);
};

Sprite.prototype.toCSS = function () {
    var out = {};
    if (this.arg.src) {
        out['background-image'] = 'url(' + this.arg.src + ')';
    }

    if (this.hasPosition()) {
        var x = this.x;
        if (x) x = '-' + x + 'px';
        var y = this.y;
        if (y) y = '-' + y + 'px';
        out['background-position'] = x + ' ' + y;
    }
    if (!isNaN(this.w)) {
        var w = this.w;
        if (w) w = w + 'px';
        out.width = w;
    }
    if (!isNaN(this.h)) {
        var h = this.h;
        if (h) h = h + 'px';
        out.height = h;
    }
    var list = [];
    var selector = this.arg.selector || '.' + this.name();
    list.push(selector);
    list.push('{');
    for (var key in out) {
        var line = key + ': ' + out[key] + ';';
        list.push(line);
    }
    list.push('}');
    return list.join(" ");
};

var mapKeys = {
    id: 1,
    name: 1,
    alt: 1,
    title: 1,
    href: 1
};

Sprite.prototype.toMap = function () {
    var key;
    var out = {};
    out.shape = "rect";
    out.href = "#";

    var x = this.x || 0;
    var y = this.y || 0;
    var w = this.w || 0;
    var h = this.h || 0;
    var c = [x, y, x + w, y + h];
    out.coords = c.join(",");

    for (key in mapKeys) {
        if (this.arg[key]) out[key] = this.arg[key];
    }

    out.name = out.name || this.name();

    var list = [];
    for (key in out) {
        var val = out[key];
        if (val == null) val = "";
        val = val.replace(/"/g, "&quot;");
        var line = key + '="' + val + '"';
        list.push(line);
    }
    return "<area " + list.join(" ") + ">";
};
