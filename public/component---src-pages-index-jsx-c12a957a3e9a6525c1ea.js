(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{196:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return o});var a=n(0),r=n.n(a),i=n(234),c=n(218),l=n(357);function o(e){var t=Object(a.useRef)(null);return console.log(e),Object(a.useEffect)(function(){s(t),window.addEventListener("resize",function(){s(t)})},[t.current]),r.a.createElement(c.a,null,r.a.createElement("svg",{ref:t,width:"100%",height:"100vh"}))}function s(e,t){if(e.current){var n=i.v(e.current);n.selectAll("*").remove();var a=e.current.clientWidth,r=e.current.clientHeight,c=function(e){return+e.profit},o=150,s=150,u=a-s-10,d=r-o-100,m=n.append("g").attr("transform","translate("+s+","+o+")"),p=i.o().domain(l.map(function(e){return e.month})).range([0,u]).paddingInner(.3),f=i.p().domain([0,i.n(l,c)]).range([d,0]).nice(),v=i.p().domain([450,2e3]).range([20,80]).nice(),h=i.p().domain([450,2e3]).range([10,24]).nice(),g=i.p().domain([450,2e3]).range([17,47]).nice(),y=i.p().domain([450,2e3]).range([90,45]).nice(),E=i.p().domain([450,2e3]).range([60,20]).nice(),w=i.a(p),x=i.b(f).tickFormat(function(e){return"$"+e});m.append("g").call(w).attr("class","x-axis").attr("transform","translate(0,"+d+")").selectAll(".tick text").style("fill","#1d2228").style("font-size",h(a)),m.append("g").call(x).attr("class","y-axis").selectAll(".tick text").style("fill","#1d2228").style("font-size",h(a)),m.selectAll("rect").data(l).enter().append("rect").attr("x",function(e){return p(e.month)}).attr("width",p.bandwidth()).attr("height",function(e){return d-f(c(e))}).attr("y",function(e){return f(c(e))}).style("fill","#1d2228"),n.append("text").text("Revenue Bar Chart").attr("x","50%").attr("y",100).style("font-size",v(a)).style("fill","#1d2228"),n.append("text").text("Month").attr("x","50%").attr("y",r-E(a)).style("font-size",g(a)).style("fill","#1d2228"),n.append("text").text("Revenue").attr("x",-r/1.7).attr("y",y(a)).style("font-size",g(a)).attr("transform","rotate(-90)").style("fill","#1d2228")}}},204:function(e,t,n){var a;e.exports=(a=n(217))&&a.default||a},207:function(e,t,n){"use strict";var a=n(208),r=n(0),i=n.n(r),c=n(225),l=n.n(c);function o(e){var t=e.description,n=e.lang,r=e.meta,c=e.title,o=a.data.site,s=t||o.siteMetadata.description;return i.a.createElement(l.a,{htmlAttributes:{lang:n},title:c,titleTemplate:"%s | "+o.siteMetadata.title,meta:[{name:"description",content:s},{property:"og:title",content:c},{property:"og:description",content:s},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:o.siteMetadata.author},{name:"twitter:title",content:c},{name:"twitter:description",content:s}].concat(r)})}o.defaultProps={lang:"en",meta:[],description:""},t.a=o},208:function(e){e.exports={data:{site:{siteMetadata:{title:"D3 training",description:"learning d3",author:"mhezzet"}}}}},217:function(e,t,n){"use strict";n.r(t);n(23);var a=n(0),r=n.n(a),i=n(96);t.default=function(e){var t=e.location,n=e.pageResources;return n?r.a.createElement(i.a,Object.assign({location:t,pageResources:n},n.json)):null}},218:function(e,t,n){"use strict";var a=n(0),r=n.n(a),i=n(207),c=n(66),l=n.n(c);n(204),n(9).default.enqueue,r.a.createContext({});function o(e){var t=window.location.pathname,n=t.substring(1)?t.substring(1):"responsive bar chart";return r.a.createElement(r.a.Fragment,null,r.a.createElement(i.a,{title:n}),r.a.createElement("div",{className:"whole"},r.a.createElement("div",{className:"side"},r.a.createElement("h1",{className:"title"},"D3 Training"),r.a.createElement("ul",{className:"nav-links"},r.a.createElement(l.a,{to:"/"},r.a.createElement("li",{className:"nav-link "+("/"===t?"nav-link-active":"")},"responsive bar chart")),r.a.createElement(l.a,{to:"/gapminder"},r.a.createElement("li",{className:"nav-link "+("/gapminder"===t?"nav-link-active":"")},"Gap Minder")),r.a.createElement(l.a,{to:"/coinstats"},r.a.createElement("li",{className:"nav-link "+("/coinstats"===t?"nav-link-active":"")},"Coin Stats")),r.a.createElement(l.a,{to:"/forcedirected"},r.a.createElement("li",{className:"nav-link "+("/forcedirected"===t?"nav-link-active":"")},"Force Directed Graph")))),r.a.createElement("div",{className:"main"},e.children)))}n.d(t,"a",function(){return o})},357:function(e){e.exports=[{month:"January",revenue:"13432",profit:"8342"},{month:"February",revenue:"19342",profit:"10342"},{month:"March",revenue:"17443",profit:"15423"},{month:"April",revenue:"26342",profit:"18432"},{month:"May",revenue:"34213",profit:"29434"},{month:"June",revenue:"50321",profit:"45343"},{month:"July",revenue:"54273",profit:"47452"}]}}]);
//# sourceMappingURL=component---src-pages-index-jsx-c12a957a3e9a6525c1ea.js.map