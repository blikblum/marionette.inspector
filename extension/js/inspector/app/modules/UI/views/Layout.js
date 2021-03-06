define([
  'marionette',
  'backbone',
  'util/Radio',
  'logger',
  'app/modules/UI/views/EmptyMoreInfo',
  'app/modules/UI/views/ViewMoreInfo',
  'app/modules/UI/models/TreeNode',
  'app/modules/UI/views/ViewTree',
  'app/modules/UI/views/LoadingView',
], function(Marionette, Backbone, Radio, logger,
   EmptyMoreInfo, ViewMoreInfo, TreeNode, ViewTree, LoadingView) {

  return Marionette.View.extend({

    template: 'ui/layout.html',

    attributes: {
      view: 'ui-layout'
    },

    className: 'app-tool ui-tool',

    regions: {
      viewTree: '[data-region="view-tree"]',
      viewMoreInfo: '[data-region="view-more-info"]'
    },

    modelEvents: {
      'change:regionTree': 'onRegionTreeUpdate'
    },

    uiCommands: {
      'show:more-info': 'showMoreInfo',
      'show:loadingView': 'showLoadingView',
      'empty:moreInfo': 'emptyMoreInfo',
      'unhighlightRows': 'unhighlightRows',
      'highlightRow': 'highlightRow'
    },

    initialize: function(options) {
      Radio.connectCommands('ui', this.uiCommands, this);
      this.viewCollection = options.viewCollection;
    },

    onRender: function() {
      logger.log('ui', 'layout rendered');
      this.onRegionTreeUpdate();
    },

    showLoadingView: function(data) {
      var cid = data.cid;

      this.getRegion('viewMoreInfo').show(new LoadingView({
        model: new Backbone.Model({cid: cid})
      }));
    },

    onRegionTreeUpdate: function() {
      var tree = this.model.viewTree();

      // if the tree is empty and we now have data replace
      // the tree with a new tree
      if (!this.viewTreeModel || !this.viewTreeModel.nodes) {
        this.viewTreeModel = new TreeNode(tree);
        // this.viewTreeModel.isCollapsed = false;

        this.getRegion('viewTree').show(new ViewTree({
          model: this.viewTreeModel,
          viewCollection: this.options.viewCollection
        }));

        // this.viewTreeModel.collapse();
        // this.viewTreeModel.expandPath('app');
      } else {
        this.viewTreeModel.updateNodes(tree.nodes);
      }
    },

    showMoreInfo: function(data) {
      var viewModel = this.options.viewCollection.findView(data.cid)

      if (!viewModel) {
        console.log('couldnt find the view', data.cid);
        return;
      }

      this.highlightRow(data);
      this.getRegion('viewMoreInfo').show(new ViewMoreInfo({
        model: viewModel,
        path: data.path
      }));
    },

    emptyMoreInfo: function(data) {
      this.highlightRow(data);
      this.getRegion('viewMoreInfo').show(new EmptyMoreInfo({
        name: data.name,
        path: data.path
      }));
    },

    unhighlightRows: function() {
      this.getRegion('viewTree')
        .$el
        .find('.is-highlighted')
        .removeClass('is-highlighted');
    },

    highlightRow: function(data) {
      var $row = this.findRowWithCid(data.cid);
      $row.trigger('highlight');

      this.scrollToRow(data.cid);
    },

    findRowWithCid: function(cid) {
      return this.$el.find("[data-cid='" + cid + "']");
    },

    scrollToRow: function(cid) {
      var $row = this.findRowWithCid(cid);
      var $list = this.getRegion('viewTree').$el;

      var isOffScreen =
        $row.offset().top < $list.offset().top ||
        $row.offset().top > $list.offset().top + $list.height();

      if (isOffScreen) {
        $list.animate({
            scrollTop: $list.scrollTop() + $row.offset().top - 2*$row.height()
        }, 100);
      }
    }
  });
});
