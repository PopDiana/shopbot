import { Json2RDF } from './Json2RDF';
import { Triple } from './Triple';
const eol = require("eol");
export class Parser {

    static parseTriples(product) {
        var rdf = Json2RDF.translate(product);
        var lines = eol.split(rdf);
        var result = [];
        lines.forEach(line => {
            var triples = line.replace('<', '').replace('>', '');
            var t = triples.split(',');
            result.push(new Triple(t[0], t[1], t[2]));
        });
        return result;
    }

    static getPrice(product) {

        // exclude shipping fees
        product = product.triples.filter(product => product.object && !product.object.toLowerCase().includes("shipping"));

        var price = null;
        var pricePredicates = this.getTriplesWithPredicate(product, "price");
        if (pricePredicates === []) return price;

        // <-, price, value>
        for (var i = 0; i < pricePredicates.length; i++) {
            if (this.isPrice(pricePredicates[i].object)) {
                price = this.sanitizePrice(pricePredicates[i].object);
                break;
            }
        }
        // <-, price, x>
        // <x, -, value>
        if (price === null) {
            for (i = 0; i < pricePredicates.length; i++) {
                var objectTriples = this.getTriplesWithSubject(product, pricePredicates[i].object);
                if (objectTriples === []) {
                    continue;
                }
                for (var j = 0; j < objectTriples.length; j++) {
                    if (this.isPrice(objectTriples[j].object)) {
                        price = this.sanitizePrice(objectTriples[j].object);
                        break;
                    }
                }
            }
        }
        return price !== null? price : NaN;
    }

    static getImage(product) {
        var image = null;
        for (var i = 0; i < product.triples.length; i++) {
            var element = product.triples[i];
            if ((this.findMatch(element.predicate, "image") ||
                this.findMatch(element.subject, "image")) && this.isLink(element.object)) {
                image = element.object;
                break;
            }
        }
        return image;
    }

    static getDescription(product) {
        var description = null;
        product.triples.forEach(element => {
            if (this.findMatch(element.predicate, "description")) {
                description = element.object;
            }
        });
        return description;
    }

    static getName(product) {
        var name = null;
        product.triples.forEach(element => {
            if (this.findMatch(element.predicate, "name") || this.findMatch(element.predicate, "title")) {
                name = element.object;
            }
        });
        return name;
    }

    static getURL(product) {
        var url = null;
        product.triples.forEach(element => {
            if (this.findMatch(element.predicate, "url") || this.findMatch(element.predicate, "link")) {
                url = element.object;
            }
        });
        return url;
    }

    static getMatches(product, attributes) {
        var matches = 0;
        if (product.description) {
            attributes.forEach(element => {
                if (this.findMatch(product.description, element.attribute)) matches += 1;
                if (this.findMatch(product.description, element.value)) matches += 1;
                if (product.name !== product.description) {
                    if (this.findMatch(product.name, element.attribute)) matches += 1;
                    if (this.findMatch(product.name, element.value)) matches += 1;
                }
            });
        }
        return matches;
    }

    static findMatch(text, word) {
        if (text && word && word !== "") return text.toLowerCase().includes(word.toLowerCase());
        return false;
    }

    static getTriplesWithPredicate(source, predicate) {
        return source.filter(t => t.predicate.toLowerCase() === predicate);       
    }

    static getTriplesWithSubject(source, subject) {
        return source.filter(t => t.subject.toLowerCase() === subject);
    }

    static isPrice(value) {
        if (value.match(/\d+/g) && !value.match(/[a-zA-z]+/g)) {
            return true;
        }
        return false;
    }

    static isLink(text) {
        return this.findMatch(text, "http");
    }

    static sanitizePrice(price) {
        return parseFloat(price.replace('$', '').replace(',', ''));
    }
}