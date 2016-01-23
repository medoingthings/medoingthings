[ ![Codeship Status for medoingthings/medoingthings](https://codeship.com/projects/704912e0-a0fa-0132-88eb-02e47b219034/status?branch=master)](https://codeship.com/projects/65577)

# Documentation for medoingthings.com

## Getting Started
Make sure [Node](nodejs.org) is installed on your machine.

Then run `npm i`. It will install all the necessary dependencies.

Now run `gulp build` to build all the relevant assets.

## Gulp Tasks

The following gulp tasks are meant to be used for development and deployment:

`gulp build:development` (defaults to `gulp`) builds all the relevant assets and runs code style checks. No uglifying here.

`gulp build:production` is used by the [deployment server](medoingthings.com/writing/2015/03/front-end-deployment-for-the-rest-of-us) to build all the assets in an optimized manner.

`gulp watch` runs `gulp` upfront and then starts to watch the source files to run the appropriate tasks, depending on what files were changed.

`gulp serve` identical to the watch task, but runs Browsersync, too. This automatically updates the browser when files change. `gulp serve --no-open` supresses the opening of a new browser window.

## ZeptoJS dependency
If new features of ZeptoJS are required, it needs to be build like described
here: https://github.com/madrobby/zepto#building

### Do this:

* Go to zeptojs folder `cd bower_components/zeptojs`
* Run `MODULES="zepto event data ie" ./make dist`, add whatever new module is needed
* Move it to assets/js `mv dist/zepto.min.js ../../assets/js`
* Update this Readme with the new module chain
* Commit the new build and readme.md
