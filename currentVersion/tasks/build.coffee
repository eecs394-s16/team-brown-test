module.exports = (grunt) ->
  grunt.registerTask "build", [
    "clean:dist",
    "coffeelint",
    "browserify",
    "html2js",
    "copy",
    "minify"
  ]
