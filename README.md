# Undulating Jigsaw Puzzle

An experimental variation on the jigsaw puzzle theme.

## What problem does it solve?

This project solves the problem of needing something like a jigsaw puzzle that isn't quite a jigsaw puzzle.

## Who has this problem?

Jigsaw puzzle enthusiasts who are looking for a change.

## How does your project solve this problem?

This project solves the problem by displaying puzzles that have pieces with undulating edges. The user can drag and rotate pieces with the mouse. When matching pieces
are placed next to each other, they snap together. When all pieces are snapped together,
the puzzle is solved.

The app keeps track of how long it takes to solve a puzzle. If the user has signed up
and logged in, their time is saved; the best three times of all uses are listed on
the puzzle's leader board.

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

A companion project, the [Undulating Jigsaw Editor](https://github.com/thatmichaelpark/undulating-jigsaw-editor), demonstrates
using Electron to create a desktop application.

## What was the most valuable piece of Customer feedback you received?

Although we did not do formal user testing, my wife discovered a bug when usernames contain spaces. Spaces are now forbidden in usernames.

## What was the biggest technical challenge you had to overcome?

I don't know about the biggest, but some of the technical challenges I faced were
- animating the puzzle piece edges
- rotating the puzzle pieces, especially as a group
- writing a SQL query to retrieve all puzzles, each puzzle having an array of best times and the names of the users who achieved those times
