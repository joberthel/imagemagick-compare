import * as chai from 'chai';
import { compare } from '../src';
import * as chaiAsPromised from 'chai-as-promised';
import { original, difference, examples } from './assets/examples';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('compare promise', () => {
    it('should return no difference for same image', async () => {
        expect(await compare(original, original)).to.equal(1);
    });

    describe('should use defined metric', () => {
        for (const example of examples) {
            it(`should use ${example.name}`, async () => {
                expect(await compare(original, difference, example.options)).to.be.closeTo(example.result, example.delta);
            });
        }
    });

    describe('error handling', () => {
        it('should reject if no options are defined', async () => {
            // @ts-expect-error
            await expect(compare()).to.eventually.be.rejectedWith(`compare()'s 1st argument should be a buffer instance`);
        });

        it('should reject if first argument is no buffer', async () => {
            await expect(compare(null, difference)).to.eventually.be.rejectedWith(`compare()'s 1st argument should be a buffer instance`);
        });

        it('should reject if second argument is no buffer', async () => {
            await expect(compare(original, null)).to.eventually.be.rejectedWith(`compare()'s 2nd argument should be a buffer instance`);
        });

        it('should reject if buffer is no image', async () => {
            await expect(compare(original, Buffer.from([]))).to.eventually.be.rejected;
        });

        it('should reject if metric does not exist', async () => {
            // @ts-expect-error
            await expect(compare(original, difference, { metric: 'NOTDEFINED' })).to.eventually.be.rejectedWith(`metric unknown`);
        });
    });
});
