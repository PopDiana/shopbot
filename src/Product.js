export class Product {
    
    constructor(retailer, triples) {
        this.name = null;
        this.price = null;
        this.url = null;
        this.description = null;
        this.matches = 0;
        this.triples = triples;
        this.image = null;
        this.retailer = retailer;
    }

}