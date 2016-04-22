module.exports = (grunt) ->
  grunt.registerTask "minify", [
    "useminPrepare",
    "concat:generated",
    "uglify:generated",
    "usemin"
  ]
