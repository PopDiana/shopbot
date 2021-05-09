import axios from 'axios'
export class BestBuyService {

    static getProducts(title) {
        return axios.get('http://localhost:3030/products?name[$like]=*' + title + '*&$sort[price]=-1*&$limit=50').then(response => {
            return response.data.data;
        }).catch(error => {
            console.log(error);
        });
    }
}