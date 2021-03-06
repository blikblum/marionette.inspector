define([
  'marionette',
  'util/Radio',
  'app/behaviors/SidebarPanes',
  'app/behaviors/ClickableProperties',
  'util/presenters/presentListeners',
  'util/presenters/presentAncestors'
], function(
    Marionette, Radio,
    SidebarPanesBehavior, ClickableProperties,
    presentListeners, presentAncestors) {

  return Marionette.View.extend({

    template: 'data/info.html',

    behaviors: {
      sidebarPanes: {
        behaviorClass: SidebarPanesBehavior,
      },
      clickableProperties: {
        behaviorClass: ClickableProperties
      }
    },

    modelEvents: {
      'change': 'render'
    },

    className: 'sidebar-panel',

    templateContext: function() {
      var infoItems = ['cid', 'id', '_pending', '_changing', '_listenerId', 'collection'];
      var instanceProperties = [
        'changed', '_previousAttributes', 'attributes',
        '_events', '_className', '_requirePath'
      ];

      var data = this.model.toJSON();

      return {
        ancestors: presentAncestors(data, infoItems, instanceProperties),
        listeners: presentListeners(data._events),
        info: _.pick(data.properties, infoItems),
        properties: _.omit(data.properties, infoItems, instanceProperties)
      };
    }
  });
})