;(function(Agent){

  // @private
  Agent.patchMarionetteModule = function(MarionetteModule) {
    debug.log('MarionetteModule detected');

    Agent.patchBackboneComponent(MarionetteModule, function(module) { // on new instance
      Agent.addCidToComponent(module);
      Agent.registerAppComponent('Module', module, {});
    });
  };

}(Agent));