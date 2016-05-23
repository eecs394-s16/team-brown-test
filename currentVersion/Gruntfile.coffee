module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-browserify"
  grunt.loadNpmTasks "grunt-html2js"
  grunt.loadNpmTasks "grunt-usemin"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-concat"

  grunt.initConfig
    paths:
      files:
        directives:
          templates: 'src/directives/**/*.html'
        coffee: 'src/**/*.coffee'
    copy:
      static:
        expand: true
        cwd: "src/"
        src: ['**/*.*', '!**/*.coffee', '!directives/**/*.html']
        dest: 'dist/'
        filter: 'isFile'
      dependencies:
        expand: true
        cwd: "bower_components/"
        src: "**"
        dest: "dist/components"
        filter: "isFile"
    browserify:
      coffee:
        files:
          'dist/module.js': ['<%= paths.files.coffee %>']
    coffeelint:
      options:
        configFile: 'coffeelint.json'
      src: '<%= paths.files.coffee %>'
    clean:
      dist:
        src: "dist/"
    pkg: grunt.file.readJSON "package.json"
    html2js:
      directives:
        options:
          module: 'module-templates'
        src: ['src/directives/**/*.html']
        dest: 'dist/directive-templates.js'
    useminPrepare:
      html:
        options:
          root: 'dist'
        src: 'src/*.html'
    usemin:
      html:
        options:
          type: 'html'
        files:
          src: [
            'dist/*.html'
          ]

  require('./tasks/default')(grunt)
  require('./tasks/build')(grunt)
  require('./tasks/minify')(grunt)
