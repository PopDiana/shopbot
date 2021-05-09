import React, { Component } from 'react';
import './App.css';

class List extends Component {

  constructor() {
    super();
    this.state = {
      products: [],
      unfiltered: [],
      priceSort: "",
      retailer: "All",
      filterApplied: false
    }
  }

  componentDidMount() {
    this.setState(
      {
        products: this.props.products,
        unfiltered: this.props.products
      }
    );
  }

  updateList(products) {
    this.setState(
      { products: products }
    );
  }

  sortByPrice(products) {
    if (this.state.priceSort !== "") {
      var filtered = products.filter(p => !isNaN(p.price));
      return filtered.sort((p1, p2) => {
        if (this.state.priceSort === "asc")
          return p1.price - p2.price
        else
          return p2.price - p1.price
      });
    }
    return products;
  }

  filter() {
    var filtered = this.state.unfiltered;
    if (this.state.retailer !== "All") {
      filtered = this.state.unfiltered.filter(p => p.retailer === this.state.retailer);
    }
    return filtered;
  }


  handleSortChange(e) {
    this.setState(
      { priceSort: e.target.value }
    );
  }

  handleFilterChange(e) {
    this.setState(
      { retailer: e.target.value }
    );
  }

  getFilteredInfo(e) {
    var products = this.filter();
    this.setState(
      { filterApplied: true }
    );
    if (products !== []) products = this.sortByPrice(products);
    this.updateList(products);
    e.preventDefault();
  }

  isListEmpty() {
    return this.state.products.length <= 1 ? true : false;
  }

  render() {
    return (
      <div>
        <div className={!this.isListEmpty() || this.state.filterApplied ? "show" : "hide"}>
          <hr />
          <form onSubmit={this.getFilteredInfo.bind(this)}>
            <select
              className="filters search-input"
              value={this.state.priceSort}
              onChange={this.handleSortChange.bind(this)}
            >
              <option value="" disabled hidden>Sort by price</option>
              <option value="asc">Price ascending</option>
              <option value="desc">Price descending</option>
            </select>
            <select
              className="filters search-input"
              value={this.state.retailer}
              onChange={this.handleFilterChange.bind(this)}
            >
              <option value="All">All retailers</option>
              <option value="Amazon">Amazon</option>
              <option value="BestBuy">BestBuy</option>
              <option value="Ebay">Ebay</option>
            </select>
            <button className="button search-button">Apply</button>
          </form>
        </div>
        <div className={this.isListEmpty() ? "show" : "hide"}>
          <h4>No results found. Try searching for a product.</h4>
        </div>
        <ul>
          {this.state.products.map((product, index) => {
            if (product.name !== undefined)
              return (
                <li key={index}>
                  <div className="li-container-div">
                    <div className="left-div">
                      <span>{product.name}</span>
                      <br />
                      <a href={product.url} target="_blank">
                        <img role="presentation" className="list-image" src={product.image} />
                      </a>
                      <br />
                      <span className="click-me">Click photo to go to site</span>

                    </div>
                    <div className="right-div">
                      <div>Price (USD): <b>{product.price}</b></div>
                      <div>Retailer: <u>{product.retailer}</u></div>
                      <br />
                      <span>Description: </span>
                      <br />
                      <i>{product.description}</i>
                    </div>
                  </div>
                </li>
              )
          })}
        </ul>
      </div>
    );
  }
}



export default List;
