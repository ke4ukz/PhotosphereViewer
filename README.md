# Photo Sphere Viewer

## Overview

## Requirements

_These libraries are in the `lib` folder so no remote file fetching should be necessary_

* `exif-js`: https://github.com/exif-js/exif-js
* `photo-sphere-viewer`: https://photo-sphere-viewer.js.org
* `three.js`: https://threejs.org/

## Test Server
From the Frontend folder, run `python3 -m http.server` and access the site at http://127.0.0.0.1:8000/default.html

## URL
* The `l` argument contains the list to show. List names start with `list_` followed by a random string (or a name maybe?)

## Image List Object
* **`title`**: title of this image list
* **`images`**: array of image information objects
  * **`src`**: path to the image (relative to the root url)
  * **`pitch`**: up/down tilt in radians (positive is up)
  * **`yaw`**: left/right pan in radians (positive is right)
  * **`zoom`**: zoom (FoV) level, 0 to 100 goes between minFov and maxFov in Viewer config
  * **`caption`**: the text that will be displayed on the nav bar and in the title of the description pane
  * **`description`**: additional text that will be shown in the description pane

## TODO
* Do something with errors besides writing to the console
* Add loading message when fetching the image (the loading progress bar seems to just be the processing of the image data? the http request starts, but the loading progress bar doesn't show up until the image is actually downloaded)
