import { expect } from 'chai';
import { version } from '../src';

describe('version', () => {
    it('should return a version', () => {
        expect(version()).to.match(/\d+\.\d+\.\d+/);
    });
});
