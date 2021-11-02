# globalfootprint.ch 
Author project  of the Certificate of Advanced Studies in Data Visualization at the <a href="https://www.hkb.bfh.ch/" target="_blank">HKB</a> in Berne.<br />Q1/2021, Thomas Iten


The project contains the source Code of the **globalfootprint.ch** web site. The web site presents various **visualizations** of the global footprint metric **number of earths**. 


## Number of earth

The number of earth is a key figure showing the ecological footprint of a country, a region or the world. The metric measures how much nature we have and how much we use.

We have one earth and if the key figure is above, we are using more resources, than the earth can regenerate in one year. Like this, the number of earth figure shows if the resource demand of a country is sustainable or not.

**Improve**
The footprint helps countries to improve sustainability and well-being as well as individuals to understand their impact on the planet. For further details see:
- [Footprint Network Homepage](https://www.footprintnetwork.org/)
- [Ecological Footprint of Countries Video](https://www.overshootday.org/lesson-what-day-is-earth-overshootday-2017)

    
    

## Project folders

Folder       | Content
------------ | -----------------------------------------------------------------
app          | The www.globalfootprint.ch web application. To keep the project small and simple, no big and heavy Web Framework is used. The site only uses HTML, CSS with Bootstrap and JavaScript with JQuery.
data         |  The original data in the download folder, together with some Python scripts for preparing the web site data in the transform folder.     
playground   | Tests and experiments for some web site parts or diagrams. 
test         | Python tests
work         | Working notes and snippets
  

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
    

---
_The end._