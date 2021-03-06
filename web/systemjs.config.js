/**
 * System configuration for Angular 2 apps
 * Adjust as necessary for your application needs.
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',

    '@angular':                   'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    '@angular2-material':         'node_modules/@angular2-material',
    'angular2-jwt':               'node_modules/angular2-jwt',
    'angular2-toaster':           'node_modules/angular2-toaster',
    'rxjs':                       'node_modules/rxjs'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'angular2-jwt':               { main: 'index.js', defaultExtension: 'js' },
    'angular2-toaster':           { main: 'index.js', defaultExtension: 'js' },
  };

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];

  var ngMaterialPackageNames = [
    'core',
    'input',
    'button',
    'checkbox',
    'progress-circle',
    'card',
  ];

  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }

  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }

  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);

  function addPackge(pkgName){
    packages['@angular2-material/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  
  ngMaterialPackageNames.forEach(addPackge);

  var config = {
    map: map,
    packages: packages
  };

  System.config(config);

})(this);