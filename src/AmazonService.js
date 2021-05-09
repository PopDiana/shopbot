import axios from 'axios';

export class AmazonService {

  static getProducts(title) {
    const params = {
      api_key: "########",
      type: "search",
      amazon_domain: "amazon.com",
      search_term: title,
      sort_by: "price_high_to_low"
    }
    return axios.get('https://api.rainforestapi.com/request', { params })
      .then(response => {
        return response.data.search_results;
      }).catch(error => {
        console.log(error);
      });
  }
}