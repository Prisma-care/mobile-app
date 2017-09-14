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
- Michiel Leyman [(@MichielLeyman)](https://github.com/MichielLeyman) - backend & project management
- Simon Westerlinck [(@siimonco)](https://github.com/siimonco) - backend & database modelling
- Jean-Pacifique Mboynincungu [(@oxnoctisxo)](https://github.com/oxnoctisxo) - frontend system analysis
- Thor Galle [(@th0rgall)](https://github.com/th0rgall) - frontend & product owner

The app was conceived in a one-month collaborative design project in a care home in Zonhoven, Belgium, in January 2017. Together with personel and dementia design researchers the team honed in on a static prototype that was later refined during the Open Summer of Code. More info about it in [this blog post](http://www.frederikvincx.com/project-prisma-helping-people-with-dementia/).

## Installation

We aim to have the app available for download in the Play Store soon. However, if you want to try it out right now, there are several options.

### 1. Prepackaged application

The easiest way is by downloading a binary release package and installing it on your device:

1. Download the latest Android package (.apk) from our [releases page](https://github.com/Prisma/mobile-app/releases).
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

3. On the command line inside the repository directory, install Cordova & Ionic. Then install the dependencies.

   ```bash
   npm install -g cordova ionic
   npm install
   ```

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

#### Option c - Android live build

This method will build, transfer & start the app on your Android device. You'll need to connect it to your PC with a USB cable beforehand. The device needs to be in developer mode with USB Debugging enabled (search on how to do this for you device if you don't know).

On your PC, you'll need to have the [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html) and [Android Studio](https://developer.android.com/studio/index.html) installed. Additionally, check whether you have the right Android SDK Platform version & SDK Tools enabled/installed in the Android Studio settings. They have to match your device's Android version.

Also, make sure that the necessary folders are in your `PATH` so that the build executables can be found in your CLI environment.

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

