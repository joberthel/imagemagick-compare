import * as fs from 'fs';
import { expect } from 'chai';
import { version, compare, compareSync, CompareMetric } from '../dist';

const original = fs.readFileSync(__dirname + '/assets/Lenna_orig.png');
const difference = fs.readFileSync(__dirname + '/assets/Lenna_diff.png');

// Map of all metrics with expected result and accepted delta
const metrics = {
    AE: [5580, 1],
    FUZZ: [0.074, 0.001],
    MAE: [0.01, 0.001],
    MEPP: [508322356, 1],
    NCC: [0.912, 0.001],
    PAE: [0.816, 0.001],
    PSNR: [22.607, 0.001],
    PHASH: [7.663, 0.001],
    MSE: [0.005, 0.001],
    RMSE: [0.074, 0.001],
    SSIM: [0.967, 0.001],
    DSSIM: [0.016, 0.001]
};

describe('version', () => {
    it('should return a version', () => {
        expect(version()).to.match(/\d+\.\d+\.\d+/);
    });
});

describe('compare', () => {
    describe('should be callable', () => {
        it('should use promise', async () => {
            expect(await compare(original, original, 'SSIM')).to.equal(1);
        });

        it('should use callback', done => {
            compare(original, original, 'SSIM', (err, res) => {
                expect(err).to.be.undefined;
                expect(res).to.equal(1);
                done();
            });
        });

        it('should use sync', () => {
            expect(compareSync(original, original, 'SSIM')).to.equal(1);
        });
    });

    describe('should use defined metric', () => {
        for (const metric in metrics) {
            it(`should use ${metric}`, async () => {
                expect(await compare(original, difference, metric as CompareMetric)).to.be.closeTo(metrics[metric][0], metrics[metric][1]);
            });
        }
    });
});
