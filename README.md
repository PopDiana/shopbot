
## Introduction
A shopbot application capable of searching products from different retailers (Amazon, BestBuy, Ebay) and filtering the results based on user choices.
The API responses are converted from [JSON to RDF](https://www.w3.org/2016/01/json2rdf.html) triples and parsed to retrieve product information and match search criteria.

### Rainforest API
Get the Rainforest API key from [here](https://app.rainforestapi.com/playground) and replace it in *AmazonService.js*.

`const params = { api_key: "########", ...`

### Ebay Product Catalog API
Get the user auth token for production environment from [here](https://developer.ebay.com/my/keys) and replace it in *EbayService.js*.

```const token = '########';```

## Getting started

1. Clone the [Best Buy API Playground](https://github.com/bestbuy/api-playground)

2. Open a new tab in your terminal. In the Best Buy API Playground, run `npm install`

3. Run `npm start`

4. From the command line, run `npm install` within this project. 

5. Run `npm start` to open with localhost.

6. Go to localhost:3000 to view the project.


