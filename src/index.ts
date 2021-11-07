const lib = require('../build/Release/compare.node');

/**
 * AE - absolute error count, number of different pixels (-fuzz affected)
 *
 * DSSIM - structural dissimilarity index
 *
 * FUZZ - mean color distance
 *
 * MAE - mean absolute error (normalized), average channel error distance
 *
 * MEPP - mean error per pixel (normalized mean error, normalized peak error)
 *
 * MSE - mean error squared, average of the channel error squared
 *
 * NCC - normalized cross correlation
 *
 * PAE - peak absolute (normalized peak absolute)
 *
 * PHASH - perceptual hash for the sRGB and HCLp colorspaces
 *
 * PSNR - peak signal to noise ratio
 *
 * RMSE - root mean squared (normalized root mean squared)
 *
 * SSIM - structural similarity index
 */
export type CompareMetric = 'AE' | 'DSSIM' | 'FUZZ' | 'MAE' | 'MEPP' | 'MSE' | 'NCC' | 'PAE' | 'PHASH' | 'PSNR' | 'RMSE' | 'SSIM';

export type CompareCallback = (err: Error | undefined, res: number) => void;

/**
 *
 * @returns The version of the installed Magick++ library
 */
export function version(): string {
    return lib.version();
}

/**
 * Compares two images using Magick++ assynchronously.
 * @param originalImage Image buffer of the original image
 * @param compareWith Image buffer of the image to compare with
 * @param metric Defaulting to "SSIM"
 * @param callback Optional callback function if you don't want to use promises
 * @returns Promise with metric result as a number
 */
export function compare(originalImage: Buffer, compareWith: Buffer, metric: CompareMetric = 'SSIM', callback?: CompareCallback): Promise<number> {
    return new Promise((resolve, reject) => {
        lib.compare(
            {
                originalImage,
                compareWith,
                metric
            },
            (err: Error | undefined, res: number) => {
                if (typeof callback === 'function') {
                    callback(err, res);
                }

                if (typeof err !== 'undefined') {
                    return reject(err);
                }

                resolve(res);
            }
        );
    });
}

/**
 * Compares two images using Magick++ synchronously.
 * @param originalImage Image buffer of the original image
 * @param compareWith Image buffer of the image to compare with
 * @param metric Defaulting to "SSIM"
 * @returns Metric result as a number
 */
export function compareSync(originalImage: Buffer, compareWith: Buffer, metric: CompareMetric = 'SSIM'): number {
    return lib.compare({
        originalImage,
        compareWith,
        metric
    });
}
