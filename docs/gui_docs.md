# SWITCH GUI Documentation

The SWITCH GUI is a mixture of several frameworks and libraries. At its core, it is a meteor application wrapped in an electron desktop app.

## Bootup Process

The bootup process is a bit complex from the fact that both meteor and electron have to be started. This is a video walkthrough of the code that boots the application:

[![Bootup video](http://monywize.com/images/video-placeholdere9f3.png?1454083235)](https://www.youtube.com/watch?v=e7QYGk9sH6s)

## Architecture

![Architecture](img/arch.png)

## Some notes

- `recharts` is being used for the charts
- Redux is installed and developed but not used
- The core application was based on [bootstrap-electron-meteor](https://github.com/bompi88/bootstrap-electron-meteor)

## Missing data in PowerPlants.csv

The following load zones exist as a shape both in Prodesen and Switch, but no data exists for them in the `loadZones` collection under `powerPlants`

```
{6, 41, 45, 47, 49, 19, 20, 52, 26}
```

## Directory structure



## Component Structure

The following is a sketch of the different component structure for the views of the application:

![home](img/home.png)
![home](img/docs_06.png)
![Evolution](img/docs_11.png)
![Inputs](img/docs_03.png)
![Capacity](img/docs_13.png)
![ProjectInfo](img/docs_18.png)
![Transmission](img/docs_21.png)


RAEL and BECI license 