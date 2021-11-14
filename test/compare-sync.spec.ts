import { expect } from 'chai';
import { compareSync } from '../src';
import { original, difference, examples } from './assets/examples';

describe('compare sync', () => {
    it('should return no difference for same image', () => {
        expect(compareSync(original, original)).to.equal(1);
    });

    describe('should use defined metric', () => {
        for (const example of examples) {
            it(`should use ${example.name}`, () => {
                expect(compareSync(original, difference, example.options)).to.be.closeTo(example.result, example.delta);
            });
        }
    });

    describe('error handling', () => {
        it('should throw error if no options are defined', () => {
            expect(compareSync.bind(null)).to.throw(`compare()'s 1st argument should be a buffer instance`);
        });

        it('should throw error if first argument is no buffer', () => {
            expect(compareSync.bind(null, null, difference)).to.throw(`compare()'s 1st argument should be a buffer instance`);
        });

        it('should throw error if second argument is no buffer', () => {
            expect(compareSync.bind(null, original, null)).to.throw(`compare()'s 2nd argument should be a buffer instance`);
        });

        it('should throw error if buffer is no image', () => {
            expect(compareSync.bind(null, original, Buffer.from([]))).to.throw();
        });

        it('should throw error if metric does not exist', () => {
            expect(compareSync.bind(null, original, difference, { metric: 'NOTDEFINED' })).to.throw('metric unknown');
        });
    });
});
