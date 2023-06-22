![color your memories](https://user-images.githubusercontent.com/11543641/28823809-acf0b10a-76bf-11e7-918e-ad34338b66c8.jpg)

Prisma is an app that strengthens the relationship between people with memory loss and the people close to them. It does this by providing a living, collaborative digital photo album that can be populated with content of interest. 
The content currently includes pictures & text added by family members, or relevant historical pictures and stories from heritage organizations.

This repository hosts the frontend of the project: a mobile app based on the [Ionic framework](https://ionicframework.com/). The app communicates with a [RESTful API](https://github.com/Prisma/api) to gather and save data.

Be sure to check out our home page [prisma.care](https://prisma.care/) for more information.

## Contributing

Want to help out?
First, peruse the [Prisma wiki](https://github.com/Prisma/documentation/wiki) to learn about the roadmap, milestones and approach to developing software for people with dementia.

## History

Project Prisma was part of [Open Knowledge Belgium](https://www.openknowledge.be/)'s [open Summer of Code 2017](http://2017.summerofcode.be/). A student team coached by Frederik Vincx [(@fritsbits)](https://github.com/fritsbits) worked on it in July 2017:
- Michiel - backend & project management
- Simon Westerlinck [(@siimonco)](https://github.com/siimonco) - backend & database modelling
- Jean-Pacifique Mboynincungu [(@oxnoctisxo)](https://github.com/oxnoctisxo) - frontend system analysis
- Thor Galle [(@th0rgall)](https://github.com/th0rgall) - frontend & product owner

The app was conceived in a one-month collaborative design project in a care home in Zonhoven, Belgium, in January 2017. Together with personel and dementia design researchers the team honed in on a static prototype that was later refined during the Open Summer of Code. More info about it in [this blog post](http://www.frederikvincx.com/project-prisma-helping-people-with-dementia/).

## Installation

The latest release version can be downloaded for Android on the [Google Play Store](https://play.google.com/store/apps/details?id=care.prisma.familyapp). An iOS version is coming soon!

With some command line & git knowledge, you can also build the development version of the app yourself. See the following section.

##  Building the app

### Setting up the development environment

1. Clone the repository

   ```bash 
   git clone https://github.com/Prisma/mobile-app.git
   ```

2. Install [npm](https://nodejs.org/en/) if you haven't already.

3. On the command line inside the repository directory, install Cordova, Ionic and Gulp. Then install the dependencies.

   ```bash
   npm install -g cordova ionic gulp
   npm install
   ```
   These commands can take a while to finish.
   
4. Set up your environment with API keys. Acquire a valid Prisma API key & YouTube API key (ask us!) and modify `environment.ts` with these values. Run `gulp develop` in the root to initialize the development environment.

Now you can run the app in various ways. Option a is used to test the app quickly in a web browser. Option b almost does the same, but adds in support for more features. Option c allows you to test the app on an Android device.

#### Option a - Ionic web server

Ionic comes with a local web server for development purposes that serves the application & recompiles on file changes. 

Because cordova.js is not included, phone-specific features will not work. Notably, adding content doesn't work.

```bash
ionic serve
```

#### Option b - Cordova Browser build

Comparable to the previous method, but here a browser implementation of Cordova is included. Note that this implementation is not fully supported yet. 

```bash
ionic cordova platform add browser
ionic cordova run browser -lc # starts a webserver, -lc enables live reloading & console logging
```

Note: `cordova run browser` defaults to Google Chrome and will crash if it is not installed. You [can use](https://stackoverflow.com/questions/38075283/how-to-change-default-browser-of-cordova-browser-platform) the option `--target=firefox` to specify another browser.

#### Option c - Android live build

This method will build, transfer & start the app on your Android device. You'll need to connect it to your PC with a USB cable beforehand. The device needs to be in developer mode with USB Debugging enabled (search how to do this for your device).

On your PC, you'll need the [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) (note: Cordova doesn't work with Java 1.9 yet, install 1.8) and [Android Studio](https://developer.android.com/studio/index.html). Additionally, make sure the right Android SDK Platform tools are installed. Do this in the Android Studio settings: in the Welcome screen, go to Configure -> SDK Platforms & check the platform that matches your device's Android version.

Now, make sure that the necessary folders are in your `PATH` so that the build executables can be found in your CLI environment.

On a MacOS/Linux system with a default Android Studio install the following lines need to be added to the shell configuration file (~/.bashrc, ~/.zshrc, ...). The locations might be different on your system, depending on where you installed Android Studio. More info [here](https://cordova.apache.org/docs/en/latest/guide/platforms/android/#setting-environment-variables).

```bash
# Substitute with the correct paths & Gradle version for your system 

# Linux 
PATH=$PATH:$HOME/Android/Sdk/platform-tools:$HOME/Android/Sdk/tools
ANDROID_HOME=$HOME/Android/Sdk
PATH=$PATH:/opt/android-studio/gradle/gradle-3.2/bin

# Mac OS 
PATH=$PATH:/Applications/Android\ Studio.app/Contents/gradle/gradle-4.1/bin
# Make gradle accessible for the cli user (needs to be executed only once)
chmod 766 /Applications/Android\ Studio.app/Contents/gradle/gradle-4.1/bin/gradle
```

Now you can build & transfer the project to your device using the Cordova `run` command.

```bash
ionic cordova run android
```

The first time you run this command it installs all used cordova plugin commads. This can take a while.

