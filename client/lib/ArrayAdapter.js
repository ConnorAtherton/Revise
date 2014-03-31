ArrayAdapter = function ( array ) {
  this.currentIndex = 0;
  this.data = array;
};

ArrayAdapter.prototype = {

  init : function ( element ) {
     element.node.textContent = this.data[this.currentIndex];
  },

  start : function ( ){
    return this.currentIndex;
  },

  change : function ( element, value ) {
    this.currentIndex = Math.abs ( (this.data.length + value) % this.data.length );
    element.node.textContent = this.data[ this.currentIndex ];
  },

  end : function ( element ) { }
}
