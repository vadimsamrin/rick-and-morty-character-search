# Dimension Index

A Vue 3 character search for the Rick and Morty API. The finished version filters as you type, waits 400 ms after the last keystroke, aborts an in-flight request when the query changes, and resets pagination to page 1 for each new search.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Search behavior

- Search is automatic; there is no submit button in the finished version.
- `SearchBar.vue` emits input changes and the parent owns API requests and pagination.
- The API's 404 response is displayed as “No characters found”.
- Results include a loading indicator and the total match count.
- `AbortController` cancels the previous request, so an older response cannot replace newer results.

The source comment in `src/App.vue` records the three Stage 2 questions and answers.
