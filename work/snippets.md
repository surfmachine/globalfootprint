# Snippets
Q1/2021, Thomas Iten


## y-axis text label 
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

## Options with Grid
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

## Control with no border and background
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