import React, { Component } from 'react';

var MenuComponent = React.createClass({
  render: function() {
    return (
      <ul id="menu">
        <li><a href="/">Home</a></li>
        <li><a href="/vineyards">Overview</a></li>
        <li><a href="/add">Add vineyard</a></li>
      </ul>
    );
  }
});

module.exports = {MenuComponent}
