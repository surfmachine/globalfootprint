# The globalfootprint.ch web applicaton
Q1/2021, Thomas Iten

This website has been created as part of a Certificate of Advanced Studies in Data Visualization
at the <a href="https://www.hkb.bfh.ch/" target="_blank">HKB</a> in Berne.

## Project folders

### App
The www.globalfootprint.ch web application. To keep the project small and simple, no big and heavy
Web Framework is used. The site only uses HTML, CSS with Bootstrap and JavaScript with JQuery.

### Data
The original data in the download folder, together with some Python scripts for preparing the 
web site data in the transform folder.     

### Playground
Tests and experiments for some web site parts or diagrams. 

- 01 Data Data Visualization
  - D3 chart samples<br />
    https://github.com/alod83/dj-infouma/tree/master/DataVisualization
  - How to build a basic line in D3.js<br />
    https://towardsdatascience.com/how-to-build-a-basic-line-in-d3-js-38f67055043f

- 02 Making a Line Chart in D3<br />
  https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/

- 03 Footprint<br />
   First Global Footprint Sample with some variations in size, mode, scale and axis visibility.

- 04 Bootstrap Controls<br />
  Collapse, Button and Radion Button Group samples with Bootstrap Version 5.
   
- 05 Footer<br /> 
  Some footer variations for the website.

- 10 handwritten<br /> 
  D3 charts in a handwritten style.

- 11 rough<br />
  Rough.js handwirtten styled charts used within the website.   

### Test
Some simple Python tests.



## HTML Resourcen

### Bootstrap
Das Bundle wurde manuell via Browser geladen und unter dem Namen
`bootstrap-5.0.0-beta2.bundle.min.js` abgespeichert. 

Damit erfolgt der Load vom eigenen Server:
```
<script src="resource/bootstrap/bootstrap-5.0.0-beta2.bundle.min.js"></script>
```

Anstelle von der deliver URL:
```
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossorigin="anonymous"></script>
```

### D3 
Hier wurde der geliche Mechanismus wie bei Bootstrap gemacht:

Lokale Resource:
```
<script src="resource/d3/d3.v4.js"></script>
```

Anstelle URL
```
<script src="https://d3js.org/d3.v4.js"></script>
```

### JQuery 
Hier wurde der geliche Mechanismus wie bei Bootstrap gemacht:

Lokale Resource:
```
<script src="resource/jquery/jquery-1.12.4.min.js"></script>
```

Anstelle URL
```
<script src="https://code.jquery.com/jquery-1.12.4.min.js"
        integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ"
        crossorigin="anonymous"></script>
```

## References

- Observable
  - https://observablehq.com
  - D3 Margin Conventions<br />
    https://observablehq.com/@d3/margin-convention

- Blocks
  - https://bl.ocks.org/
  - Change the color of an axis<br /> 
    https://bl.ocks.org/d3noob/629790fc15cc1afba0253f29a4d246e7
  
- Mike Bostock
  - https://bl.ocks.org/mbostock
  - https://bl.ocks.org/mbostock/3183403

- D3 Graph Gallery<br /> 
  - https://www.d3-graph-gallery.com/
  - https://www.d3-graph-gallery.com/line
  - https://www.d3-graph-gallery.com/lollipop.html
  - https://www.d3-graph-gallery.com/graph/density_basic.html

- GitHut sample of advanced charts with multiples
  - https://githut.info/
   
- Roughjs   
  - https://roughjs.com/
  - https://www.tutorialdocs.com/tutorial/roughjs/api-options.html
   
- Misc
  - How to make interactive line chart in D3<br /> 
    https://medium.com/analytics-vidhya/how-to-make-interactive-line-chart-in-d3-js-4c5f2e6c0508 

  - Multiples<br />
    https://bl.ocks.org/pstuffa/5ac32bf4e3810a7ae61866ee5de02d41
  
  - Plotting a Line Chart With Tooltips Using React and D3.js<br />
    https://medium.com/better-programming/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

  - Coole Link Effekte
    https://codepen.io/hafizfattah/pen/tkgyK 
    
## Snippets

### y-axis text label 
```
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left / 2)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em") //The dy attribute indicates a shift along the y-axis on the position of an element or its content.
    .attr("font-size", "12px")
    .style("text-anchor", "middle")
    .text("Number of earth");
```

### Options with Grid
```
/**
 * Create a grid element with an option.
 *
 * @param option The option record with: {title, name, items} where items is a list of:{id, value, label, checked}
 * @param grids The grid number for large, medium and small, like [3,3,12].
 * @returns The html option element.
 */
function createOption2(option, grids) {
    let buf = [];

    buf.push("<div id=\"" + option.name + "\"  class=\"option col-lg-" + grids[0] + " col-md-" + grids[1] + " col-sm-" + grids[2] + "\">");

    buf.push("<b>" + option.title +"</b>");
    option.items.forEach(function (item) {
        buf.push(createOptionItem(option.name, item))
    });

    buf.push("</div>");

    return buf.join("");
}

/**
 * Create a single option item.
 *
 * @param name The name of the option (all option of a group have the same name).
 * @param item The item: {id, value, label, checked}
 * @returns The html option element item.
 */
function createOptionItem2(name, item) {
    let buf = [];

    buf.push("<label class=\"radio-inline\">");
    buf.push("<input id=" + item.id + " type=\"radio\" name=" + name + " value=" + item.value + " ");
    buf.push("onclick=\"handleOptionClick(this)\" ");
    buf.push(item.checked);
    buf.push("> " + item.label + "</label>");

    return buf.join("");

}

```

### Control with no border and background
```
.controlGroup {
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 18px;
    margin-right: 18px;
    padding: 0px;
}

.controlTitle {
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    font-weight: bold;
}

.controlPair {
    margin-right: 0px;
    padding-left: 0px;
}
```    
    
---
_The end._