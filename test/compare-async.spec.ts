import { expect } from 'chai';
import { compare } from '../src';
import { original, difference, examples } from './assets/examples';

describe('compare async', () => {
    it('should return no difference for same image', done => {
        compare(original, original, undefined, (err, res) => {
            expect(err).to.be.undefined;
            expect(res).to.equal(1);
            done();
        });
    });

    describe('should use defined metric', () => {
        for (const example of examples) {
            it(`should use ${example.name}`, done => {
                compare(original, difference, example.options, (err, res) => {
                    expect(err).to.be.undefined;
                    expect(res).to.be.closeTo(example.result, example.delta);
                    done();
                });
            });
        }
    });

    describe('error handling', () => {
        it('should return error if no options are defined', done => {
            compare(null, null, undefined, (err, res) => {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal(`compare()'s 1st argument should be a buffer instance`);
                expect(res).to.be.undefined;
                done();
            });
        });

        it('should return error if first argument is no buffer', done => {
            compare(null, difference, undefined, (err, res) => {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal(`compare()'s 1st argument should be a buffer instance`);
                expect(res).to.be.undefined;
                done();
            });
        });

        it('should return error if second argument is no buffer', done => {
            compare(original, null, undefined, (err, res) => {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal(`compare()'s 2nd argument should be a buffer instance`);
                expect(res).to.be.undefined;
                done();
            });
        });

        it('should return error if buffer is no image', done => {
            compare(original, Buffer.from([]), undefined, (err, res) => {
                expect(err).to.be.instanceOf(Error);
                expect(res).to.be.undefined;
                done();
            });
        });

        it('should return error if metric does not exist', done => {
            // @ts-expect-error
            compare(original, difference, { metric: 'NOTDEFINED' }, (err, res) => {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('metric unknown');
                expect(res).to.be.undefined;
                done();
            });
        });
    });
});
