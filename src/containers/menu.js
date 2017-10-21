import React, { Component } from 'react';

var MenuComponent = React.createClass({
  render: function() {
    return (
      <ul id="menu">
        <li><a href="/">Home</a></li>
        <li><a href="/vineyards">Listing</a></li>
        <li><a href="/add">Admin</a></li>
      </ul>
    );
  }
});

module.exports = {MenuComponent}
