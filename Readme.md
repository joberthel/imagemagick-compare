# imagemagick-compare [![CircleCI](https://circleci.com/gh/joberthel/imagemagick-compare/tree/main.svg?style=svg)](https://circleci.com/gh/joberthel/imagemagick-compare/tree/main)

[ImageMagick](http://www.imagemagick.org/)'s [Compare](https://imagemagick.org/script/compare.php) binding for [Node](http://nodejs.org/).

## Features

-   Native bindings to the C/C++ Magick++ library.
-   Supports promises, async and sync.
-   Supports all metrics.
-   Full typescript support.

## Prerequisites

You will need the following dependencies installed on your machine. Currently only linux is supported.

-   node-gyp dependencies (python3, pkgconfig, make, g++)
-   imagemagick
-   imagemagick-dev

## Usage

### Version

Returns the version of the installed Magick++ library.

```ts
import { version } from 'imagemagick-compare';

console.log(version());
```

### Compare

Compares two images using Magick++ and returns the result as a number.

-   `originalImage`: Image buffer of the original image.
-   `compareWith`: Image buffer of the image to compare with.
-   `metric`: Defaults to `SSIM`. List of supported metrics [below](#supported-metrics).

#### Promise usage

```ts
import * as fs from 'fs';
import { compare } from 'imagemagick-compare';

const original = fs.readFileSync(__dirname + '/assets/Lenna_orig.png');
const compareWith = fs.readFileSync(__dirname + '/assets/Lenna_diff.png');

compare(originalImage, compareWith, 'SSIM').then(res => console.log);
```

#### Async usage

```ts
import { compare } from 'imagemagick-compare';

// ...

compare(originalImage, compareWith, 'SSIM', (err, res) => {
    if (typeof err !== 'undefined') {
        throw err;
    }

    console.log(res);
});
```

#### Sync usage

```ts
import { compare } from 'imagemagick-compare';

// ...

console.log(compareSync(originalImage, compareWith, 'SSIM'));
```

## Supported metrics

-   `AE`: absolute error count, number of different pixels (-fuzz affected)
-   `DSSIM`: structural dissimilarity index
-   `FUZZ`: mean color distance
-   `MAE`: mean absolute error (normalized), average channel error distance
-   `MEPP`: mean error per pixel (normalized mean error, normalized peak error)
-   `MSE`: mean error squared, average of the channel error squared
-   `NCC`: normalized cross correlation
-   `PAE`: peak absolute (normalized peak absolute)
-   `PHASH`: perceptual hash for the sRGB and HCLp colorspaces
-   `PSNR`: peak signal to noise ratio
-   `RMSE`: root mean squared (normalized root mean squared)
-   `SSIM`: structural similarity index
