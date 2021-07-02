(this["webpackJsonporder-book"]=this["webpackJsonporder-book"]||[]).push([[0],{12:function(e,t,r){},14:function(e,t,r){"use strict";r.r(t);var c=r(3),o=r.n(c),a=r(7),n=r.n(a),s=(r(12),r(2)),b=r(0);function i(e){var t=e.groupSize;return Object(b.jsx)("select",{className:"order-book-select",children:Object(b.jsxs)("option",{children:["Group ",t]})})}var d=r(4),u=r.n(d);function l(e){var t=e.rows,r=e.side,c="buy"===r,o="sell"===r;return Object(b.jsxs)("div",{className:"order-book-table",children:[Object(b.jsx)("div",{className:u()("order-book-table__header",{"order-book-table__header--buy":c,"order-book-table__header--sell":o}),children:["price","size","total"].map((function(e,t){return Object(b.jsx)("span",{children:e},t)}))}),Object(b.jsx)("div",{className:"order-book-table__body",children:t.map((function(e,t){var r=Object(s.a)(e,4),a=r[0],n=r[1],i=r[2],d=r[3];return Object(b.jsxs)("div",{className:u()("order-book-table__row",{"order-book-table__row--buy":c,"order-book-table__row--sell":o}),children:[Object(b.jsx)("div",{className:u()("order-book-table__meter",{"order-book-table__meter--buy":c,"order-book-table__meter--sell":o}),style:{width:"".concat(d,"%")}}),Object(b.jsx)("span",{className:u()("order-book-table__cell",{"order-book-table__cell--buy":c,"order-book-table__cell--sell":o}),children:a}),Object(b.jsx)("span",{children:n}),Object(b.jsx)("span",{children:i})]},t)}))})]})}function O(e){var t=e.data,r=t.asks,c=t.bids,o=e.groupSize,a=e.onClickToggleFeed,n=e.onClickKillFeed,s=e.webSocketIsOpen;return Object(b.jsxs)("div",{className:"order-book",children:[Object(b.jsxs)("div",{className:"order-book__header",children:[Object(b.jsx)("div",{children:"Order Book"}),Object(b.jsx)(i,{groupSize:o})]}),Object(b.jsxs)("div",{className:"order-book__content",children:[Object(b.jsx)(l,{rows:r,side:"sell"}),Object(b.jsx)(l,{rows:c,side:"buy"})]}),Object(b.jsxs)("div",{className:"order-book__footer",children:[Object(b.jsx)("button",{className:"button button--toggle",disabled:!s,onClick:a,children:"Toggle Feed"}),Object(b.jsx)("button",{className:"button button--kill",disabled:!s,onClick:n,children:"Kill Feed"})]})]})}var j=r(5),f=r(1),k=WebSocket.CONNECTING,_=WebSocket.CLOSING,E=WebSocket.CLOSED,h=WebSocket.OPEN;function S(e){var t=e.asks,r=e.bids;return{asks:N(t),bids:N(r)}}function p(e,t){switch(e){case.5:var r=Math.floor(t);return t-r>=e?r+e:r;case 1:return Math.floor(t);default:return t}}var v=function(e){return 0===Object(s.a)(e,2)[1]};function N(e){return e.reduce((function(e,t){var r=Object(s.a)(t,2),c=r[0],o=r[1];return Object(f.a)(Object(f.a)({},e),{},Object(j.a)({},c,o))}),{})}function g(e,t){for(var r={},c=0,o=Object.entries(t);c<o.length;c++){var a=Object(s.a)(o[c],2),n=a[0],b=a[1],i=p(e,Number(n));"undefined"===typeof r[i]?r[i]={size:b,total:0,percentage:0}:r[i]={size:r[i].size+b,total:0,percentage:0}}return Object.entries(r).sort((function(e,t){var r=Object(s.a)(e,1)[0],c=Object(s.a)(t,1)[0];return r<c?1:r>c?-1:0})).map((function(e){var t=Object(s.a)(e,2),r=t[0],c=t[1],o=c.size,a=c.total,n=c.percentage;return[Number(r),o,a,n]}))}function y(e,t){var r=t.asks,c=t.bids;return{asks:g(e,r),bids:g(e,c)}}var m=function(e){return e.readyState===WebSocket.OPEN},C=function(e){return e.groupSize};function x(e,t){switch(t.type){case"WEBSOCKET_CLOSED":return Object(f.a)(Object(f.a)({},e),{},{readyState:E});case"WEBSOCKET_CLOSING":return Object(f.a)(Object(f.a)({},e),{},{readyState:_});case"WEBSOCKET_CONNECTING":return Object(f.a)(Object(f.a)({},e),{},{readyState:k});case"WEBSOCKET_ERROR":return e;case"WEBSOCKET_OPEN":return Object(f.a)(Object(f.a)({},e),{},{readyState:h});case"WEBSOCKET_RECEIVE_MESSAGE":try{var r="string"===typeof t.data?JSON.parse(t.data):{},c="info"===r.event,o="subscribed"===r.event,a="string"===typeof r.feed&&r.feed.length>0,n=Array.isArray(r.asks),b=Array.isArray(r.bids),i=n&&b,d=a&&r.feed.endsWith("_snapshot");switch(!0){case c:return Object(f.a)(Object(f.a)({},e),{},{connected:!0});case o&&a:return Object(f.a)(Object(f.a)({},e),{},{feed:r.feed});case d&&i:var u=C(e),l=S(r);return Object(f.a)(Object(f.a)({},e),{},{orderBook:l,aggregatedOrderBook:y(u,l)});case i&&!d:var O=r,j=O.asks,p=O.bids,g=C(e),m=function(e){return e.orderBook}(e),x=m.asks,w=m.bids,B=N(j.filter(v)),T=N(p.filter(v)),W=[],K=[];Object.entries(x).forEach((function(e){var t=Object(s.a)(e,2),r=t[0],c=t[1];"undefined"!==typeof B[Number(r)]&&W.push([Number(r),c])})),Object.entries(w).forEach((function(e){var t=Object(s.a)(e,2),r=t[0],c=t[1];"undefined"!==typeof T[Number(r)]&&K.push([Number(r),c])}));var z=S({asks:W.concat(j),bids:K.concat(p)});return Object(f.a)(Object(f.a)({},e),{},{orderBook:z,aggregatedOrderBook:y(g,z)});default:return e}}catch(I){return console.error(I),e}default:return e}}function w(e){var t=Object(c.useReducer)(x,{connected:!1,aggregatedOrderBook:{asks:[],bids:[]},groupSize:.5,orderBook:{asks:{},bids:{}},readyState:null}),r=Object(s.a)(t,2),o=r[0],a=r[1],n=Object(c.useRef)(),b=function(e){return e.readyState}(o),i=m(o),d=Object(c.useCallback)((function(e){if(i){var t=n.current;t&&t.send(JSON.stringify(e))}}),[i,n]);return Object(c.useEffect)((function(){if(null===b)try{var t=function(e,t){try{var r=new WebSocket(e);return t({type:"WEBSOCKET_CONNECTING"}),r.onopen=function(){t({type:"WEBSOCKET_OPEN"})},r.onerror=function(e){console.error(e),t({type:"WEBSOCKET_ERROR"})},r.onmessage=function(e){t({type:"WEBSOCKET_RECEIVE_MESSAGE",data:e.data})},r}catch(c){throw c}}(e,a);n.current=t}catch(r){console.error(r)}}),[b,e]),[o,d]}function B(){var e=w("wss://www.cryptofacilities.com/ws/v1"),t=Object(s.a)(e,2),r=t[0],o=t[1],a=C(r),n=m(r),i=function(e){return e.aggregatedOrderBook}(r),d=function(e){return e.connected}(r),u=Object(c.useCallback)((function(){n&&o({event:"subscribe",feed:"book_ui_1",product_ids:["PI_XBTUSD"]})}),[o,n]);return Object(c.useEffect)((function(){d&&u()}),[d,u]),Object(b.jsx)("div",{className:"container",children:Object(b.jsx)(O,{data:i,groupSize:a,onClickToggleFeed:u,onClickKillFeed:u,webSocketIsOpen:n})})}n.a.render(Object(b.jsx)(o.a.StrictMode,{children:Object(b.jsx)(B,{})}),document.querySelector("main"))}},[[14,1,2]]]);
//# sourceMappingURL=main.87eb4c44.chunk.js.map