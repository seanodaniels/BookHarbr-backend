# BookHarbr

A simple app to create lists of books. For a live demo, please visit https://bookharbr.com/ and login as demo/demo.

## Tech Breakdown

BookHarbr is a litle project I created to showcase the Javascript and React that I have learned. The core of the app is built in NodeJS and React, and a breakdown of the other technologies is as follows:

- **Redux, React-Redux, Redux Toolkit** For handling global state.
- **MongoDB and Mongoose**
- **Express** For the BookHarbr API.
- **Axios**
- **React Router**
- **bcrypt, jsonwebtoken** Used for token authentication.
- **Jest**
- **Flexbox**

The book search is powered by the OpenLibrary.org API. Information from that API is used to build the BookHarbr book lists which are stored at Mongo Atlas, which also houses user information.