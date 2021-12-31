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
  // update cart item
  update(id, newQty) {
    let storedItem = this.items[id];
    storedItem.qty = newQty;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty = this.calTotalQty();
    this.totalPrice = this.calTotalPrice();
  }
  // calculate total quantity
  calTotalQty() {
    let qty = 0;
    Object.values(this.items).forEach((item) => {
      qty = qty + item.qty;
    });
    return qty;
  }
  // calculate total price
  calTotalPrice() {
    let price = 0;
    Object.values(this.items).forEach((item) => {
      price = price + item.price;
    });
    return price;
  }
  // convert object to array
  generateArray() {
    return Object.values(this.items);
  }
};
