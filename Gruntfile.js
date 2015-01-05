var pkgjson = require('./package.json');

var config = {
    pkg: pkgjson,
    dist: 'js/resources'
};

module.exports = function (grunt) {

    // Configuration
    grunt.initConfig({
        config: config,
        pkg: config.pkg,
        bower: grunt.file.readJSON('./.bowerrc'),
        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: 'bower_components/angular/angular.min.js',
                    dest: '<%= config.dist %>/includeFirst',
					flatten: true
                },{
                    expand: true,
                    src: 'bower_components/angular*/angular-*.min.js',
                    dest: '<%= config.dist %>',
					flatten: true
                },{
                    expand: true,
                    src: 'bower_components/angular*/angular.*.min.js',
                    dest: '<%= config.dist %>',
					flatten: true
                },{
                    expand: true,
					cwd : 'bower_components/angular-ui/build/',
                    src: ['angular-ui.js', 'angular-ui.css'],
                    dest: '<%= config.dist %>',
					flatten: true
                },{
                    expand: true,
                    cwd: 'bower_components/ng-table/',
					src: ['ng-table.min.js', 'ng-table.min.css'],
                    dest: '<%= config.dist %>',
					flatten: true
                },{
                    expand: true,
                    src: 'bower_components/angularjs-toaster/toaster*',
                    dest: '<%= config.dist %>',
					flatten: true
                },{
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist/',
					src: ['js/bootstrap.js', 'css/bootstrap.css'],
                    dest: '<%= config.dist %>',
					flatten: true
                },{
                    expand: true,
                    cwd: 'bower_components/jquery/dist/',
					src: ['jquery.min.js'],
                    dest: '<%= config.dist %>/includeFirst',
					flatten: true
                },{
                    expand: true,
                    cwd: 'bower_components/jquery-ui/',
					src: ['jquery-ui.min.js', 'themes/ui-lightness/jquery-ui.css'],
                    dest: '<%= config.dist %>/includeFirst',
					flatten: true
                },{
                    expand: true,
                    cwd: 'bower_components/gsap/src/minified',
					src: ['tweenmax.min.js'],
                    dest: '<%= config.dist %>',
					flatten: true
                }]
            }
        },
		includeSource: {
			options: {
				basePath: 'src/main/webapp/resources/js/angular',
				baseUrl: 'resources/'
			},
			myTarget: {
				files: {
					'index.html'    : 'templates/index.tlp.html'
				}
			}
		}
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-include-source');

    grunt.registerTask('default', [
        'copy',
		'includeSource'
    ]);
};