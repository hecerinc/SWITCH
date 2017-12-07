# Installation guide


## Requirements

The GUI has 3 dependencies: 

1. [yarn](https://yarnpkg.com/en/)
2. Node.js >= 10.0.1
3. Meteor.js

## Cloning the repository

Run the following `git clone` in your Terminal:

```
$ git clone https://github.com/hecerinc/SWITCH.git
```

The project will be cloned into a local version in the `SWITCH` folder.

## Installation


1. Install yarn from the homepage
2. Install yarn in the Meteor installation
```
$ meteor npm i -g yarn
```
3. Install the packages from yarn
```
$ cd switch && yarn install
```
4. Configure the repository
```
$ yarn run config
```
5. Run the application
```
$ yarn run dev
```