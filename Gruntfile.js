// Gruntfile.js

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            all: {
                src: ['./*.js', 'bin/*.js', 'lib/*.js', 'test/*.js']
            },
            options: {
                eqnull: true,
                laxcomma: true // I001: Comma warnings can be turned off with 'laxcomma'.
            }
        }
    });

    grunt.registerTask('default', ['jshint']);
};