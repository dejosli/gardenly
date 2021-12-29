// exports
module.exports = class Cart {
  // initialize object properties
  constructor(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  }
  // add to cart

  add(item, id) {
    let storedItem = this.items[id];
    // if item doesn't exist in cart
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  }
  // convert object to array
  generateArray() {
    return Object.values(this.items);
  }
};
