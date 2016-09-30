# Undulating Jigsaw Puzzle

An experimental variation on the jigsaw puzzle theme.

## What problem does it solve?

This project solves the problem of needing something like a jigsaw puzzle that isn't quite a jigsaw puzzle.

## Who has this problem?

Jigsaw puzzle enthusiasts who are looking for a change.

## How does your project solve this problem?

This project solves the problem by displaying puzzles that have pieces with undulating edges.

## What web APIs did it use?

When the user clicks the Pause button, a quotation is displayed. That quotation is retrieved via the Forismatic API.

## What technologies did it use?

The front end is built with React.js and Material-ui.
The back end is an Express.js server running on Node.js.

The server uses Knex.js to communicate with a PostgreSQL database. Ancillary
technologies include
- JSON Web Tokens for user authentication
- the Axios promise-based HTTP library
- bcrypt-as-promised, Joi, humps, etc.

The puzzle uses HTML canvas elements, one element per puzzle piece.

Unit and integration tests were written using Mocha, Chai, and Supertest.

## What was the most valuable piece of Customer feedback you received?

Although we did not do formal user testing, my wife discovered a bug when usernames contain spaces. Spaces are now forbidden in usernames.

## What was the biggest technical challenge you had to overcome?

I don't know about the biggest, but some of the technical challenges I faced were
- animating the puzzle piece edges
- rotating the puzzle pieces, especially as a group
- writing a SQL query to retrieve all puzzles, each puzzle having an array of best times and the names of the users who achieved those times
