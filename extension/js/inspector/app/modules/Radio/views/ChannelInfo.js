define([
  'marionette',
  'util/Radio',
  "text!templates/devTools/radio/info.html",
  'app/behaviors/SidebarPanes',
  'app/behaviors/ClickableProperties'
], function(Marionette, Radio, tpl, SidebarPanesBehavior, ClickableProperties) {

  return Marionette.View.extend({

    template: tpl,

    behaviors: {
      sidebarPanes: {
        behaviorClass: SidebarPanesBehavior,
      },
      clickableProperties: {
        behaviorClass: ClickableProperties
      }
    },
    // todo: replace by templateContext
    serializeData: function() {
      var data = {};
      _.extend(data, this.serializeModel(this.model));
      return data;
    }
  });
})