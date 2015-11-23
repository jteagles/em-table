import Ember from 'ember';

function getContentAtPath(row) {
  var contentPath = this.get('contentPath');

  if(contentPath) {
    return row.get(contentPath);
  }
  else {
    throw new Error("contentPath not set!");
  }
}

export default Ember.Object.extend({
  contentPath: null,
  headerCellName: "Not Available!",
  searchAndSortable: true,

  width: "",

  customStyle: Ember.computed('width', function () {
    return 'width:%@'.fmt(this.get('width'));
  }),

  getSearchValue: getContentAtPath,
  getSortValue: getContentAtPath,
  getCellContent: getContentAtPath
});