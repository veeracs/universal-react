import express from 'express';
import http from 'http';

//  import the following for server-side routing with React Router

import React from 'react';

/*  
  renderToString from react-dom package takes a React component 
  and produces HTML string output of the component
*/

import { renderToString } from 'react-dom/server';

/*
  match - a function used to find a matching route for a URL

  RoutingContext - a React component provided by React Router that we’ll need to render. 
  This wraps up our components and provides some functionality that ties 
  React Router together with our app.
*/

import { match, RoutingContext } from 'react-router';

import AppComponent from './components/app';
import IndexComponent from './components/index';



const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('*', (req, res) => {
  //  call match, giving it the routes object we defined earlier and req.url, which contains the URL of the request.
  //  It calls a callback function we give it, with err,redirectLocation and props as the arguments. 
  match({ routes, location: req.url }, (err, redirectLocation, props) => {
    if (err) {
      // something went badly wrong, so 500 with a message
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      // we matched a ReactRouter redirect, so redirect from the server
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      // if we got props, that means we found a valid component to render
      // for the given route
      const markup = renderToString(<RoutingContext {...props} />);
      /*
        <MyComponent a="foo" b="bar" />

        // OR:

        const props = { a: "foo", b: "bar" };
        <MyComponent {...props} />
      */
      // render `index.ejs`, but pass in the markup we want it to display
      res.render('index', { markup })

    } else {
      // no route match, so 404. In a real app you might render a custom
      // 404 view here
      res.sendStatus(404);
    }
  });
});


const server = http.createServer(app);

server.listen(3003);
server.on('listening', () => {
  console.log('Listening on 3003');
});