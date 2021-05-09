import React, { Component } from 'react';
import logo from './logo.svg';
import List from './List';
import './normalize.css';
import './App.css';
import { BestBuyService } from './BestBuyService';
import { AmazonService } from './AmazonService';
import { Parser } from './Parser';
import { Product } from './Product';
import { EbayService } from './EbayService';



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products,
      unprocessed: [],
      loading: false,
      attributes: [{ attribute: "", value: "" }]
    }
  }

  onChanges(inputChanges, e) {
    var changes = {};
    changes[inputChanges] = e.target.value;
    this.setState(changes);
  }

  onNewTitleValue(e) {
    this.setState({
      titleValue: e.target.value
    });
  }

  onNewMinPriceValue(e) {
    this.setState({
      minPrice: e.target.value
    });
  }

  onNewMaxPriceValue(e) {
    this.setState({
      maxPrice: e.target.value
    });
  }

  addProducts(products) {
    this.updateProducts(this.state.unprocessed.concat(products));
  }

  getAmazonProducts() {
    return AmazonService.getProducts(this.state.titleValue).then(async (response) => {
      var data = response.slice(0);
      var products = [];
      data.forEach(product => {
        products.push(new Product("Amazon", Parser.parseTriples(product)))
      });
      this.addProducts(products);
    }).catch((error) => {
      console.log(error)
    });
  }

  getBestBuyProducts() {
    return BestBuyService.getProducts(this.state.titleValue).then((response) => {
      var data = response.slice(0);
      var products = [];
      data.forEach(product => {
        products.push(new Product("BestBuy", Parser.parseTriples(product)))
      });
      this.addProducts(products);
    }).catch((error) => {
      console.log(error)
    });
  }

  getEbayProducts() {
    return EbayService.getProducts(this.state.titleValue).then((response) => {
      var data = response.slice(0);
      var products = [];
      data.forEach(product => {       
        products.push(new Product("Ebay", Parser.parseTriples(product)))      
      });
      this.addProducts(products);
    }).catch((error) => {
      console.log(error)
    });
  }

  filterByPrice() {
    var min = parseFloat(this.state.minPrice);
    var max = parseFloat(this.state.maxPrice);
    if (!isNaN(min) || !isNaN(max)) {
      var filteredByPrice = [];
      this.state.unprocessed.forEach(product => {
        var price = product.price;
        if (price !== null && price !== NaN) {
          if (isNaN(min)) {
            if (price <= max) {
              filteredByPrice.push(product);
            }
          } else if (isNaN(max)) {
            if (price >= min) {
              filteredByPrice.push(product);
            }
          } else {
            if (price >= min && price <= max) {
              filteredByPrice.push(product);
            }
          }
        }
      });
      this.updateProducts(filteredByPrice);
    }
  }

  

  getProductAttributes() {
    var updatedProducts = [];
    this.state.unprocessed.forEach(product => {
      var newProduct = product;
      newProduct.image = Parser.getImage(product);
      newProduct.name = Parser.getName(product);
      newProduct.url = Parser.getURL(product);
      newProduct.price = Parser.getPrice(product);
      var description = Parser.getDescription(product);
      if (description !== null) {
        newProduct.description = description;
      } else {
        newProduct.description = newProduct.name;
      }
      newProduct.matches = Parser.getMatches(newProduct, this.state.attributes);
      updatedProducts.push(newProduct);
    });
    this.updateProducts(updatedProducts);
  }

  async getSearchedInfo(e) {
    e.preventDefault();
    if (this.state.titleValue) {

      this.startLoading();
      await this.getAmazonProducts();
      await this.getBestBuyProducts();
      await this.getEbayProducts();

      this.getProductAttributes();
      this.filterByPrice();
      this.sortByMatches();
      this.endLoading();

    }
  }

  startLoading() {
    this.setState({
      loading: true
    });
  }

  sortByMatches() {
    if(this.inputAttributes())
    this.updateProducts(this.state.unprocessed.filter(p => p.matches !== 0).sort((p1, p2) => p2.matches - p1.matches));
  }

  inputAttributes() {
    var check = false;
    this.state.attributes.forEach(attribute => {
      if(attribute.attribute !== "" || attribute.value !== "")
        check = true;
    });
    return check;
  }

  endLoading() {
    this.setState({
      products: this.state.unprocessed,
      loading: false
    });
  }

  updateProducts(products) {
    this.setState({
      unprocessed: products
    });
  }

  handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...this.state.attributes];
    list[index][name] = value;
    this.setAttributes(list);
  };

  handleAddClick = () => {
    this.setAttributes([...this.state.attributes, { attribute: "", value: "" }]);
  };

  handleRemoveClick = index => {
    const list = [...this.state.attributes];
    list.splice(index, 1);
    this.setAttributes(list);
  };

  setAttributes(list) {
    this.setState({
      attributes: list
    });
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h2>Shopbot | Searcher</h2>
        </div>
        <form onSubmit={this.getSearchedInfo.bind(this)}>
          <input className="search-input search" type="text" placeholder="Product title" onChange={this.onNewTitleValue.bind(this)} value={this.state.titleValue} />
          <input className="search-input" type="text" placeholder="Min. price" onChange={this.onNewMinPriceValue.bind(this)} value={this.state.minPrice} />
          <input className="search-input" type="text" placeholder="Max. price" onChange={this.onNewMaxPriceValue.bind(this)} value={this.state.maxPrice} />
          <br />
          {this.state.attributes.map((element, index) => {
            return (
              <div key={index}>
                <input className="search-input" type="text" placeholder="Attribute" name="attribute" onChange={e => this.handleInputChange(e, index)} value={element.attribute} />
                <input className="search-input" type="text" placeholder="Value" name="value" onChange={e => this.handleInputChange(e, index)} value={element.value} />
                {this.state.attributes.length !== 1 && <button type="button" onClick={() => this.handleRemoveClick(index)} className="search-input button">-</button>}
                <br/>
                {this.state.attributes.length - 1 === index && <button type="button" onClick={this.handleAddClick} className="search-input button">+ Add attribute</button>}
              </div>);
          })}
          <br />
          <button className="search-input button search-button">Search</button>
        </form>

        {this.state.loading ?
          (<div className="spinner">
            <div className="loader">
            </div> </div>)
          : (<div>
            <List
              products={this.state.products}
            />
          </div>)
        }
      </div>
    );
  }
}

export default App;
