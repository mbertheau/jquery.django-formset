'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('django-formset.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
    },
    coffeelint: {
      src: {
        src: ['src/**/*.coffee']
      },
      test: {
        src: ['test/**/*.coffee']
      },
      options: {
        'arrow_spacing': {'level': 'error'},
        'colon_assignment_spacing': {'level': 'error',
                                     'spacing': {'left': 0, 'right': 1}},
        'cyclomatic_complexity': {'level': 'warn'},
        'line_endings': {'level': 'error'},
        'newlines_after_classes': {'level': 'error', 'value': 1},
        'no_empty_param_list': {'level': 'error'},
        'no_implicit_parens': {'level': 'error'},
        'no_standalone_at': {'level': 'error'},
        'space_operators': {'level': 'error'},
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: ['src/**/*.coffee'],
        tasks: ['coffee:src', 'coffeelint:src', 'qunit', 'clean', 'concat', 'uglify']
      },
      test: {
        files: ['test/**/*.coffee', 'test/django-formset.html'],
        tasks: ['coffee:test', 'coffeelint:test', 'qunit', 'clean', 'concat', 'uglify']
      },
    },
    coffee: {
      options: {
        bare: true,
        sourceMap: true,
      },
      src: {
        files: {
          'src/django-formset.js': 'src/django-formset.coffee'
        },
      },
      test: {
        files: {
          'test/django-formset_test.js': 'test/django-formset_test.coffee'
        },
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');

  // Default task.
  grunt.registerTask('default', ['coffee', 'coffeelint', 'jshint', 'qunit', 'clean', 'concat', 'uglify']);

};
