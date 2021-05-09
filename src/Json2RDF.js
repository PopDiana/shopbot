export class Json2RDF {
   
    static translate(src) {
         var json = JSON.parse(JSON.stringify(src));
         var url = "root";
         var rdf = this.triplify(url, json, "");
         return rdf;
    }
    static triplify (url, obj, s) {
         if (typeof obj === "object") {
           for (var i in obj) {
             if (i === "events")
               s += this.map_events(url, obj, i);
             else if (i === "properties")
               s += this.map_properties(url, obj, i);
             else if (i === "actions")
               s += this.map_actions(url, obj, i);
             else
               s += this.map_field(url, obj, i);
           }
         }
         return s.replaceAll('undefined', '');
      }
    static map_events(url, obj, i) {
        var value = obj[i];
        
        if (typeof value === "string") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "number") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "object") {
          var s = "";
          for (var j in value) {
            s += '<' + url + ',' + i + ',' + j + '>\n';
            if (typeof value[j] === "string")
              s += '<' + j + ',type,' + value[j] + '>\n';
            else if (typeof value[j] === "object") {
              for (var k in value[j]) {
                 s += '<' + j + ',param,' + k + '>\n';
                 if (typeof value[j][k] === "string")
                   s += '<' + k + ',type,' + value[j][k] + '>\n';
              }
            }
          }
          return s;
        }
        
        if (Array.isArray(value)) {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (value == null) {
          return '<' + url + ',' + i + ',null>\n';
        }
      }
    static map_properties(url, obj, i) {
        var value = obj[i];
        
        if (typeof value === "string") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "number") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "object") {
          var s = "";
          for (var j in value) {
            s += '<' + url + ',' + i + ',' + j + '>\n';
            if (typeof value[j] === "string")
              s += '<' + j + ',type,' + value[j] + '>\n';
            else if (typeof value[j] === "object") {
              for (var k in value[j]) {
                var field = value[j];
                var fvalue = field[k];
                if (typeof (value[j][k]) === "object") {
                  for (var l in fvalue) {
                    s += '<' + j + ',property,' + l +'>\n';
                    s += '<' + l + ',type,' + fvalue[l] +'>\n';
                  }
                }
                else
                  s += '<' + j + ',' + k + ',' + value[j][k] +'>\n';
              }
            }
          }
          return s;
        }
        
        if (Array.isArray(value)) {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (value == null) {
          return '<' + url + ',' + i + ',null>\n';
        }
      }
    static map_actions(url, obj, i) {
        var value = obj[i];
        
        if (typeof value === "string") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "number") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "object") {
          var s = "";
          for (var j in value) {
            s += '<' + url + ',' + i + ',' + j + '>\n';
            if (typeof value[j] === "string")
              s += '<' + j + ', type, ' + value[j] + '>\n';
            else if (typeof value[j] === "object") {
              for (var k in value[j]) {
                 var field = value[j];
                 var fvalue = field[k];
                 if (typeof fvalue === "object") {
                   for (var l in fvalue) {
                     s += '<' + j + ',' + k + ',' + l +'>\n';
                     s += '<' + l + ',type,' + fvalue[l] +'>\n';
                   }
                 }
                 else
                   s += '<' + j + ',' + k + ',' + value[j][k] +'>\n';
              }
            }
          }
          return s;
        }
        
        if (Array.isArray(value)) {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (value == null) {
          return '<' + url + ',' + i + ',null>\n';
        }
      }
    static map_field(url, obj, i) {
        var value = obj[i];
        
        if (i === "@context")
          return "";
          
        if (typeof value === "string") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "number") {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (typeof value === "object") {
          var s = "";
          for (var j in value) {
            s += '<' + url + ',' + i + ',' + j + '>\n';
            if (typeof value[j] === "string")
              s += '<' + j + ',type,' + value[j] + '>\n';
            else if (typeof value[j] === "object") {
              for (var k in value[j]) {
                 s += '<' + j + ',param,' + k + '>\n';
                 if (typeof value[j][k] === "string")
                   s += '<' + k + ',type,' + value[j][k] + '>\n';
              }
            }
          }
          return s;
        }
        
        if (Array.isArray(value)) {
          return '<' + url + ',' + i + ',' + value + '>\n';
        }
        
        if (value == null) {
          return '<' + url + ',' + i + ',null>\n';
        }
      }
  };
  