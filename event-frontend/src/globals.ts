import $ from 'jquery';
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';

declare global {
  interface Window {
    React: typeof React;
    createReactClass: typeof createReactClass;
    ReactDOM: typeof ReactDOM;
    $: typeof $;
    jQuery: typeof $;
  }
}

window.React = React;
window.createReactClass = createReactClass;
window.ReactDOM = ReactDOM;
window.$ = window.jQuery = $;
