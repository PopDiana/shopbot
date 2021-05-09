import axios from 'axios';
// TO DO: Use Ebay Oauth client to get the token
const token = '########';

export class EbayService {

    static getProducts(title) {
        const config = {
            method: 'get',
            url: 'https://api.ebay.com/buy/browse/v1/item_summary/search?q=' + title + '&limit=50',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        return axios(config).then(response => {
            return response.data.itemSummaries;
        }).catch(error => {
            console.log(error);
        });
    }
}
