const products = [];

module.exports = class Product {
  constructor(t, p, d) {
    this.title = t;
    this.price = p;
    this.description = d;
  }

  save() {
    products.push(this);
  }

  static delete(i) {
    products.splice(i, 1);
  }

  static fetchAll() {
    return products;
  }
}