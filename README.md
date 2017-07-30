# Prisma.care App

Prisma is an app that strengthens the relationship between people with memory loss and the people close to them. It does this by providing a living, collaborative digital photo album that can be populated with content of interest to these people.

This repository hosts the frontend of the project: a mobile app based on the [Ionic framework](https://ionicframework.com/). The app communicates with a [RESTful API](https://github.com/Prisma/prisma-backend) to gather and save data.

Be sure to check out our home page [prisma.care](https://prisma.care/) for more information!

## History

Project Prisma was part of [Open Knowledge Belgium](https://www.openknowledge.be/)'s [open Summer of Code 2017](http://2017.summerofcode.be/). A student team coached by Frederik Vincx [(@fritsbits)](https://github.com/fritsbits) worked on it in July 2017:
- Michiel Leyman [(@MichielLeyman)](https://github.com/MichielLeyman) - backend & project management
- Simon Westerlinck [(@siimonco)](https://github.com/siimonco) - backend & database modelling
- Jean-Pacifique Mboynincungu [(@oxnoctisxo)](https://github.com/oxnoctisxo) - frontend system analysis
- Thor Galle [(@th0rgall)](https://github.com/th0rgall) - frontend & product owner

## Installation

We aim to have the app available for download in the Play Store soon. However, if you want to try it out right now, there are several options.

### 1. Prepackaged application

The easiest way is by downloading a binary release package and installing it on your device:

1. Download the latest Android package (.apk) from our [releases page](https://github.com/Prisma/prisma-frontend/releases).
2. In your Android device, look for the setting "Unknown sources" (probably in your security settings), and check/allow it.
3. Transfer the .apk file to your Android device. Now you can install Prisma from there using your file manager of choice.

### 2. Using the development tools 

If you have some command line & git experience, this is a more flexible way to get the latest version of the app.

#### Setting up the development environment

1. Clone the repository

   ```bash 
   git clone https://github.com/Prisma/prisma-frontend.git
   ```

2. Install [npm](https://www.npmjs.com/) if you haven't already.

3. On the command line inside the repository, install Cordova & Ionic. Then install the dependencies.

   ```bash
   npm install -g cordova ionic
   npm install
   ```


Now you can run the app in various ways:

#### a) Ionic web server

Ionic comes with a local web server for development purposes that serves the application & recompiles on file changes. 

Because cordova.js is not included, phone-specific features will not work. Notably, adding content doesn't work.

```bash
ionic serve
```

#### b) Cordova Browser build

Comparable to the previous method, but here a browser implementation of Cordova is included. Note that this implementation is not fully supported yet. 

```bash
ionic cordova platform add browser
ionic cordova run browser # starts a webserver
```

#### c) Android build

In order to build for Android, you'll need to have the [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html), [Android Studio](https://developer.android.com/studio/index.html) and the appropriate [Android SDK tools](https://developer.android.com/studio/intro/update.html) for your device installed. 

Also, make sure that the necessary folders are in your `PATH` so that the build executables can be found.

On a Linux system with a default Android Studio install the following lines need to be added to the terminal configuration file. It might be different on your system.

```bash
PATH=PATH:$HOME/Android/Sdk/platform-tools:$HOME/Android/Sdk/tools
ANDROID_HOME=$HOME/Android/Sdk
```

Now you can build & transfer the project to your device using the Cordova `run` command.

```bash
ionic cordova platform add android
ionic cordova run android
```

