# WWU Campus Map using ESRI's JS SDK #

## Building a production version of the website ##

For this project, I am using [Vite](https://vitejs.dev/) as a development environment. Vite is a combonation tool that includes a develepment server and a build profile (among many other things). 

For package management I am using [NPM (Node Package Manager)](https://www.npmjs.com/). This provides an easy way to install the neccessary packages and keep everything up to date. It will look at the `package.json` file for dependencies and then install those into a node_modules directory within the project.

Both of these tools are required.

### Steps ###

1. Install NPM using [these instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. Download the github repository and unzip the files to the same directory. This is the source directory for the project
3. In the source directory, run the command `npm install`
    - This will install the dependencies in the `package.json` file (ArcGIS SDK, Vite)
4. Run the command `npm run build`
    - This runs the `vite build` script which will create a `dist` folder in the source directory with a production build of the website.
    - Vite will only package the files required by the import statements at the top of the `main.js` file.

## Running a development server ##

Vite also has the ability to run a test server on your local machine which will allow you to test changes before they are ready for production.

### Steps ###

1. Follow steps 1 and 2 from above
2. Run the command `npm run start`
    - This will start a development server on `localhost:XXXXX` which you can navigate to in a browser.
    - Press q in the terminal to quit the server

## MISC ##

## Attributions

Created by Stuart Reckase with symbology by Stephan Freelan

Data sourced from WWU

Made with ESRI's JavaScript SDK