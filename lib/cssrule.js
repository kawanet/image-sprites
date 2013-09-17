/*! cssrule.js */

module.exports = Rule;

function Rule(rule) {
    this.rule = rule;
}

Rule.prototype.get = function (key) {
    var declarations = this.rule.declarations;
    if (!declarations) return;
    var value;
    for (var i = 0; i < declarations.length; i++) {
        var decl = declarations[i];
        if (decl.property == key) return decl.value;
    }
};

Rule.prototype.declarations = function () {
    if (!this.rule.declarations) return;
    var map = {};
    this.rule.declarations.forEach(function (decl) {
        map[decl.property] = decl.value;
    });
    return map;
};

Rule.prototype.height = function () {
    return px(this.get("height"));
};

Rule.prototype.width = function () {
    return px(this.get("width"));
};

Rule.prototype.backgroundImage = function () {
    var bgImage = this.get("background-image") || this.get("background");
    if (!bgImage) return;
    if (bgImage.search(/url\(.*\)/) < 0) return;
    bgImage = bgImage.replace(/^.*url\(/, "").replace(/\).*$/, "");
    return bgImage;
};

Rule.prototype.backgroundPosition = function () {
    var bgPosition = this.get("background-position");
    if (bgPosition) return bgPosition;
    var bg = this.get("background");
    if (!bg) return;
    bg = bg.replace(/(no-)?repeat/, ' ');
    bg = bg.replace(/url\(.*?\)/, ' ');
    bg = bg.replace(/#\w+/, ' ');
    bg = bg.replace(/^\s+/, '').replace(/\s+/, ' ').replace(/\s+$/, '');
    if (bg === '') return;
    return bg;
};

Rule.prototype.backgroundPositionX = function () {
    var pos = (this.backgroundPosition() || "").split(/\s+/);
    return px(pos[0]);
};

Rule.prototype.backgroundPositionY = function () {
    var pos = (this.backgroundPosition() || "").split(/\s+/);
    return px(pos[1]);
};

function px(str) {
    if (str == null) return;
    if (str.search(/px$/) > -1) {
        return str.replace(/px$/, '') - 0;
    }
    if (str == "0") return 0;
}
