import Ember from 'ember';

import layout from '../templates/components/em-table-column';

export default Ember.Component.extend({
  layout: layout,

  definition: null,
  rows: null,
  index: 0,

  tableDefinition: null,
  dataProcessor: null,
  adjustedWidth: null,
  defaultWidth: "",

  classNames: ['table-column'],
  classNameBindings: ['inner', 'extraClassNames'],

  inner: Ember.computed('index', function () {
    return !!this.get('index');
  }),

  extraClassNames: Ember.computed("definition.classNames", function () {
    var classNames = this.get("definition.classNames");
    if(classNames) {
      return classNames.join(" ");
    }
  }),

  didInsertElement: function () {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.setWidth();
      this.setMinWidth();
    });
  },

  setMinWidth: Ember.observer("definition.minWidth", function () {
    this.$().css("minWidth", this.get('definition.minWidth'));
  }),

  setWidth: Ember.observer("adjustedWidth", "defaultWidth", function () {
    var thisElement = this.$();
    thisElement.css("width", this.get('adjustedWidth') || this.get('defaultWidth'));
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.get('parentView').send('columnWidthChanged', thisElement.width(), this.get("definition"), this.get("index"));
    });
  }),

  _onColResize: function (event) {
    var data = event.data,
        width;

    if(!data.startEvent) {
      data.startEvent = event;
    }

    width = data.startWidth + event.clientX - data.startEvent.clientX;
    data.thisObj.set('adjustedWidth', width);
  },

  _endColResize: function (event) {
    var thisObj = event.data.thisObj;
    Ember.$(document).off('mousemove', thisObj._onColResize);
    Ember.$(document).off('mouseup', thisObj._endColResize);
  },

  actions: {
    sort: function () {
      var definition = this.get('definition'),
          beforeSort = definition.get('beforeSort');

      if(!beforeSort || beforeSort.call(definition, definition)) {
        let columnId = this.get('definition.id'),
            sortOrder = this.get('tableDefinition.sortOrder') === 'desc' ? 'asc' : 'desc';

        this.get('parentView').send('sort', columnId, sortOrder);
      }
    },
    startColResize: function () {
      var mouseTracker = {
        thisObj: this,
        startWidth: this.$().width(),
        startEvent: null
      };

      Ember.$(document).on('mousemove', mouseTracker, this._onColResize);
      Ember.$(document).on('mouseup', mouseTracker, this._endColResize);
    }
  }
});
