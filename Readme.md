# imagemagick-compare [![CircleCI](https://img.shields.io/circleci/build/github/joberthel/imagemagick-compare/main)](https://circleci.com/gh/joberthel/imagemagick-compare/tree/main) [![codecov](https://img.shields.io/codecov/c/gh/joberthel/imagemagick-compare?token=JSAR7F2AIF)](https://codecov.io/gh/joberthel/imagemagick-compare)

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

## Installation

```
npm i imagemagick-compare
```

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
-   `options`: Object with metric options. More details [below](#compare-options).

#### Promise usage

```ts
import * as fs from 'fs';
import { compare } from 'imagemagick-compare';

const original = fs.readFileSync(__dirname + '/assets/Lenna_orig.png');
const compareWith = fs.readFileSync(__dirname + '/assets/Lenna_diff.png');
const options = { metric: 'SSIM', radius: 2 };

compare(originalImage, compareWith, options).then(res => console.log(res));
```

#### Async usage

```ts
import { compare } from 'imagemagick-compare';

// ...

compare(originalImage, compareWith, options, (err, res) => {
    if (typeof err !== 'undefined') {
        throw err;
    }

    console.log(res);
});
```

#### Sync usage

```ts
import { compareSync } from 'imagemagick-compare';

// ...

console.log(compareSync(originalImage, compareWith, options));
```

## Compare options

-   `metric`: Defaults to `SSIM`. List of supported metrics [below](#supported-metrics).
-   `radius`: Will only be used for `SSIM` and `DSSIM` metric.
-   `sigma`: Will only be used for `SSIM` and `DSSIM` metric.
-   `k1`: Will only be used for `SSIM` and `DSSIM` metric.
-   `k2`: Will only be used for `SSIM` and `DSSIM` metric.

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
