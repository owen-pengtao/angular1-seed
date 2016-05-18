/*
 * Copyright (c) 2016 TIBCO Software Inc.
 * All Rights Reserved.
 */

var path = require('path');
module.exports = function (grunt) {

    // Project configuration.
    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),
            publicDir: 'src/main',
            testDir: 'src/test',
            distDir: 'target/staging',
            clean: {
                dist: ['<%= distDir %>'],
                tmp: ['.tmp']
            },
            nodeunit: {
                files: ['<%= testDir %>/nodeunit/**/*_test.js']
            },
            jshint: {
                options: {
                    node: true
                },
                gruntfile: {
                    src: 'Gruntfile.js'
                },
                lib: {
                    src: ['!<%= publicDir %>/assets/**/*.js']
                }
            },
            useminPrepare: {
                html: '<%= publicDir %>/index.html',
                options: {
                    dest: '<%= distDir %>/public',
                    flow: {
                        html: {
                            steps: {
                                js: ['concat', 'uglifyjs'],
                                css: ['cssmin']
                            },
                            post: {}
                        }
                    }
                }
            },
            uglify: {
                options: {
                    beautify: false, // set to true to debug
                    mangle: true  // set to false for debug
                }
            },
            // Renames files for browser caching purposes
            filerev: {
                dist: {
                    src: [
                        '<%= distDir %>/public/js/{,*/}*.js',
                        '<%= distDir %>/public/components/{,*/}*.js',
                        '<%= distDir %>/public/css/{,*/}*.css',
                        '<%= distDir %>/public/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            },
            less: {
                development: {
                    options: {
                        sourceMap: false
                    },
                    files: [
                        {
                            expand: true,
                            cwd: '<%= publicDir %>/assets',
                            src: '**/less/*.less',
                            dest: '<%= publicDir %>/assets/css/',
                            rename: function (dest, src) {
				return dest + src.replace('less/', '').replace('.less', '.css');
                            }
                        }
                    ]
                },
                product: {
                    files: [
                        {
                            expand: true,
                            cwd: '<%= publicDir %>/assets',
                            src: '**/less/*.less',
                            dest: '<%= distDir %>/public/css/',
                            rename: function (dest, src) {
				return dest + src.replace('less/', 'styles/').replace('.less', '.css');
                            }
                        }
                    ]
                }
            },
            ngAnnotate: {
                dist: {
                    files: [
                        {
                            expand: true,
                            cwd: '.tmp/concat/scripts',
                            src: '*.js',
                            dest: '.tmp/concat/scripts'
                        }
                    ]
                }
            },
            copy: {
                public: {
                    files: [
                        {
                            expand: true,
                            dot: true,
                            cwd: '<%= publicDir %>',
                            dest: '<%= distDir %>/public',
                            src: [
                                '**/*.html',
                                'locales/*.json',
                                'assets/img/*',
                                'assets/fonts/**',
                                '*.json'
                            ]
                        },
                        {
                            expand: true,
                            flatten: false,
                            dot: true,
                            cwd: '<%= publicDir %>',
                            dest: '<%= distDir %>/public',
                            src: [
                                'swagger-ui/**'
                            ]
                        }
                    ]
                }
            },

            // Performs rewrites based on filerev and the useminPrepare configuration
            usemin: {
                html: ['<%= distDir %>/{,*/}*.html'],
                css: ['<%= distDir %>/public/css/{,*/}*.css'],
                options: {
                    assetsDirs: ['<%= distDir %>/public', '<%= distDir %>/public/assets/img']
                }
            },
            bower: {
                install: {
                    options: {
                        targetDir: '<%= publicDir %>/assets/libs',
                        layout: "byComponent",
                        install: true,
                        verbose: false,
                        cleanTargetDir: true,
                        cleanBowerDir: true
                    }
                }
            },
            // Test settings
            karma: {
                unit: {
                    configFile: 'src/test/karma/karma.conf.js',
                    singleRun: true
                }
            },

            watch: {
                html: {
                    tasks: [],
                    options: {
                        livereload: true
                    },
                    files: ['<%= publicDir %>/**/*.js', '<%= publicDir %>/**/*.html', '<%= publicDir %>/**/img/**']
                },
                less: {
                    tasks: ['less:development'],
                    options: {
                        livereload: true
                    },
                    files: ['<%= publicDir %>/**/*.less']
                }
            },


            replace: {
                index: {
                    src: ['<%= distDir %>/public/index.html'],
                    overwrite: true,                 // overwrite matched source files
                    replacements: [
                        {
                            from: /<script src="http:\/\/localhost:35729.*<\/script>/g,
                            to: ""
                        }
                    ]
                },
                bid: {
                    src: ['.tmp/concat/js/optimized.js'],
                    overwrite: true,
                    replacements: [
                        {
                            from: /var BUILD_VERSION = ".*";/g,
                            to: 'var BUILD_VERSION = "<%= process.env.BID || 0 %>";'
                        }
                    ]
                }
            },

            webfont: {
                icons: {
                    src: '<%= publicDir %>/assets/icons/*.svg',
                    dest: '<%= publicDir %>/assets/fonts',
                    destCss: '<%= publicDir %>/assets/less/import',
                    options: {
                        stylesheet: 'less',
                        font: 'bwpm-icon-fonts',
                        fontFilename: 'bwpm-icon-fonts',
                        hashes: false,
                        htmlDemo: false,
                        relativeFontPath: '../fonts',
                        types: "eot,woff,ttf,svg",
                        templateOptions: {
                            baseClass: 'bwpm-icon',
                            classPrefix: 'bwpm-icon_',
                            mixinPrefix: 'bwpm-icon-'
                        }
                    }
                }
            }
        });

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // Load the plugin that provides the “uglify” task.
    grunt.loadNpmTasks('grunt-webfont');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'check-modules', 'jshint', 'nodeunit', 'less:development', 'clean:tmp']);

    grunt.registerTask('package', ['clean', 'jshint', 'less:product', 'useminPrepare', 'copy:public', 'replace:index', 'concat', 'ngAnnotate', 'cssmin', 'uglify', 'filerev', 'usemin', 'clean:tmp']);

    grunt.registerTask('test', ['clean']);

    grunt.registerTask('dev', ['watch']);
    
    grunt.registerTask('copySource', 'Copy public source to target.', function() {
        grunt.config.set('publicDir', 'target/public');
        grunt.task.run('copy:src2tgt');
    });

};
