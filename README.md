# Project Prisma App

This is a repository for an Ionic app for [Project Prisma](http://www.frederikvincx.com/project-prisma-helping-people-with-dementia). The Ionic app is meant for Android and iOS devices.

The app communicates with a RESTful [backend](https://github.com/oSoc17/prisma-backend) API.

## About

Project Prisma part of [open Summer of Code 2017](https://osoc17.slack.com/messages). A student team coached by Frederik Vincx is working on it now:
- Michiel Leyman (@MichielLeyman) - backend & project management
- Simon Westerlinck (@siimonco) - backend
- Jean-Pacifique Mboynincungu (@oxnoctisxo) - frontend & system analysis
- Thor Galle (@th0rgall) - frontend & user testing

## Installation

Run `npm install` on your command line. Of course, you'll need to have [npm](https://www.npmjs.com/) installed first.

## Running the app

Local web server:

```bash
ionic serve
```

Publish to Android:

```bash
ionic cordova platform add android
ionic cordova run android
```
