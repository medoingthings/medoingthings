[ ![Codeship Status for medoingthings/medoingthings](https://codeship.com/projects/704912e0-a0fa-0132-88eb-02e47b219034/status?branch=master)](https://codeship.com/projects/65577)

# Documentation for medoingthings.com

## Getting Started
Make sure [Node](nodejs.org) is installed on your machine.

Then run `npm i`. It will install all the necessary dependencies.

Now run `gulp build` to build all the relevant assets.

## ZeptoJS dependency
If new features of ZeptoJS are required, it needs to be build like described
here: https://github.com/madrobby/zepto#building

### Do this:

* Go to zeptojs folder `cd bower_components/zeptojs`
* Run `MODULES="zepto event data ie" ./make dist`, add whatever new module is needed
* Move it to assets/js `mv dist/zepto.min.js ../../assets/js`
* Update this Readme with the new module chain
* Commit the new build and readme.md
