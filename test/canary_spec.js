import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {canary} from '../src/js/canary.js'

describe('canary()', () => {
  it('should pass a canary test.', () => {
    expect(canary()).to.equal("canary");
  })
})
