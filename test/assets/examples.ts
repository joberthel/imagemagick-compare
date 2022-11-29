import * as fs from 'fs';
import { CompareOptions } from '../../src';

export const original = fs.readFileSync(__dirname + '/Lenna_orig.png');
export const difference = fs.readFileSync(__dirname + '/Lenna_diff.png');

export const examples: { name: string; options: CompareOptions; result: number; delta: number }[] = [
    { name: 'AE', options: { metric: 'AE' }, result: 5580, delta: 1 },
    { name: 'FUZZ', options: { metric: 'FUZZ' }, result: 0.074, delta: 0.001 },
    { name: 'MAE', options: { metric: 'MAE' }, result: 0.01, delta: 0.001 },
    { name: 'MEPP', options: { metric: 'MEPP' }, result: 508322356, delta: 1 },
    { name: 'NCC', options: { metric: 'NCC' }, result: 0.910, delta: 0.001 },
    { name: 'PAE', options: { metric: 'PAE' }, result: 0.816, delta: 0.001 },
    { name: 'PSNR', options: { metric: 'PSNR' }, result: 22.607, delta: 0.001 },
    { name: 'PHASH', options: { metric: 'PHASH' }, result: 7.663, delta: 0.001 },
    { name: 'MSE', options: { metric: 'MSE' }, result: 0.005, delta: 0.001 },
    { name: 'RMSE', options: { metric: 'RMSE' }, result: 0.074, delta: 0.001 },
    { name: 'SSIM', options: { metric: 'SSIM' }, result: 0.967, delta: 0.001 },
    { name: 'DSSIM', options: { metric: 'DSSIM' }, result: 0.016, delta: 0.001 },
    { name: 'DSSIM (with radius, sigma, k1 and k2)', options: { metric: 'DSSIM', radius: 2, sigma: 1, k1: 0.01, k2: 0.03 }, result: 0.012, delta: 0.001 },
    { name: 'SSIM', options: { metric: 'SSIM' }, result: 0.967, delta: 0.001 },
    { name: 'SSIM (default)', options: {}, result: 0.967, delta: 0.001 },
    { name: 'SSIM (with radius, sigma, k1 and k2)', options: { metric: 'SSIM', radius: 2, sigma: 1, k1: 0.01, k2: 0.03 }, result: 0.976, delta: 0.001 }
];
