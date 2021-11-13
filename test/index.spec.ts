import * as fs from 'fs';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { version, compare, compareSync, CompareOptions } from '../src';

chai.use(chaiAsPromised);

const { expect } = chai;

const original = fs.readFileSync(__dirname + '/assets/Lenna_orig.png');
const difference = fs.readFileSync(__dirname + '/assets/Lenna_diff.png');

const examples: { name: string; options: CompareOptions; result: number; delta: number }[] = [
    { name: 'AE', options: { metric: 'AE' }, result: 5580, delta: 1 },
    { name: 'FUZZ', options: { metric: 'FUZZ' }, result: 0.074, delta: 0.001 },
    { name: 'MAE', options: { metric: 'MAE' }, result: 0.01, delta: 0.001 },
    { name: 'MEPP', options: { metric: 'MEPP' }, result: 508322356, delta: 1 },
    { name: 'NCC', options: { metric: 'NCC' }, result: 0.912, delta: 0.001 },
    { name: 'PAE', options: { metric: 'PAE' }, result: 0.816, delta: 0.001 },
    { name: 'PSNR', options: { metric: 'PSNR' }, result: 22.607, delta: 0.001 },
    { name: 'PHASH', options: { metric: 'PHASH' }, result: 7.663, delta: 0.001 },
    { name: 'MSE', options: { metric: 'MSE' }, result: 0.005, delta: 0.001 },
    { name: 'RMSE', options: { metric: 'RMSE' }, result: 0.074, delta: 0.001 },
    { name: 'SSIM', options: { metric: 'SSIM' }, result: 0.967, delta: 0.001 },
    { name: 'DSSIM', options: { metric: 'DSSIM' }, result: 0.016, delta: 0.001 },
    { name: 'DSSIM with radius, sigma, k1 and k2', options: { metric: 'DSSIM', radius: 2, sigma: 1, k1: 0.01, k2: 0.03 }, result: 0.012, delta: 0.001 },
    { name: 'SSIM', options: { metric: 'SSIM' }, result: 0.967, delta: 0.001 },
    { name: 'SSIM with radius, sigma, k1 and k2', options: { metric: 'SSIM', radius: 2, sigma: 1, k1: 0.01, k2: 0.03 }, result: 0.976, delta: 0.001 }
];

describe('version', () => {
    it('should return a version', () => {
        expect(version()).to.match(/\d+\.\d+\.\d+/);
    });
});

describe('compare', () => {
    describe('should be callable', () => {
        it('should use promise', async () => {
            expect(await compare(original, original)).to.equal(1);
        });

        it('promise should reject', async () => {
            // @ts-expect-error
            await expect(compare()).to.eventually.be.rejectedWith(`compare()'s 1st argument should be a buffer instance`);
            await expect(compare(null, difference)).to.eventually.be.rejectedWith(`compare()'s 1st argument should be a buffer instance`);
            await expect(compare(original, null)).to.eventually.be.rejectedWith(`compare()'s 2nd argument should be a buffer instance`);
            await expect(compare(original, Buffer.from([]))).to.eventually.be.rejected;
        });

        it('should use callback', done => {
            compare(original, original, {}, (err, res) => {
                expect(err).to.be.undefined;
                expect(res).to.equal(1);
                done();
            });
        });

        it('should use sync', () => {
            expect(compareSync(original, original)).to.equal(1);
        });

        it('sync should throw errors', async () => {
            expect(compareSync.bind(null)).to.throw(`compare()'s 1st argument should be a buffer instance`);
            expect(compareSync.bind(null, null, difference)).to.throw(`compare()'s 1st argument should be a buffer instance`);
            expect(compareSync.bind(null, original, null)).to.throw(`compare()'s 2nd argument should be a buffer instance`);
            expect(compareSync.bind(null, original, Buffer.from([]))).to.throw();
        });
    });

    describe('should use defined metric', () => {
        for (const example of examples) {
            it(`should use ${example.name}`, async () => {
                expect(await compare(original, difference, example.options)).to.be.closeTo(example.result, example.delta);
                expect(compareSync(original, difference, example.options)).to.be.closeTo(example.result, example.delta);
            });
        }
    });
});
