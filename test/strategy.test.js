const chai = require('chai')
const AppleStrategy = require('../lib/strategy');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new AppleStrategy({
    }, function(){});
    
    it('should be named apple', function() {
      expect(strategy.name).to.equal('apple');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new AppleStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
  
  
});