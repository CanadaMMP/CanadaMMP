import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {bindAllMethods} from '../src/js/util';

describe('bindAllMethods()', function() {
  it('should bind all methods to "this" (i.e, the class)', function(){
    class TestClass {
      constructor(){
        this.mood = ":("
        bindAllMethods(this);
      }
      prozac() {
        this.mood = ":)"
      }
    }

    let tc = new TestClass;
    expect(tc.mood).to.equal(':(')
    tc.prozac()
    expect(tc.mood).to.equal(':)')
  })
})
