# Tekniska Högskolans Studentkår

ths.kth.se  
Responsive Angular 4 Web Application designed to work with the Wordpress [JSON REST API](http://wp-api.org).

## Prerequisites

1. Install [Node.js](http://nodejs.org)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

## Setting Up Wordpress

1. Download and install Wordpress ([Download link](https://wordpress.org/download/))
2. Enable pretty permalinks (`Settings -> Permalinks`), select "custom structure" and use the string `/%post_id%/%postname%`.
3. Install the [**JSON REST API (WP-API)**](https://wordpress.org/plugins/json-rest-api/) plugin. Easiest way is to use the `Plugins -> Add New` feature of the Wordpress
   admin interface. Manual install instructions can be found on the [WP-API repo](https://github.com/WP-API/WP-API#installation).

## Installation and running app locally

Install all dependencies and serve the app locally

```
1. Go to directory "/thskth.se"
2. Run `npm install` to install all packages.
3. Run `ng serve` to run the app locally.
```

## Building the app

Build the app for development or distribution

### Building the app for development

Build the app for development using following command

```
ng build --dev
```

### Building the app for distribution

Build the app for distribution using following command

```
ng build --prod
```

## Developing

Here is an outline of the folder structure:

```
./src
   |- app               // The Angular app itself
   |   |- services        // houses shared services
   |   |-
   |
   |- assets            // Any static assets such as images, icons, svg and fonts.
   |- style              // SASS files for such as global classes, mixins and variables

./build                 // dev build created when Angular CLI.
./dist                  // minified, bundled distribution build created by Angular CLI.
```

## Built With

- [Angular 4](http://angularjs.blogspot.se/2017/03/angular-400-now-available.html) - Open source JavaScript framework to build web applications in HTML and JavaScript
- [SASS](http://sass-lang.com/) - CSS Preprocessors
- [Angular CLI](https://cli.angular.io/) - CLI tool for Angular
- [NodeJS](https://nodejs.org/en/) - JavaScript runtime

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
