/* global instantsearch */

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "hexdocs", // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
        host: "localhost",
        port: "8108",
        protocol: "http",
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  //  filterBy is managed and overridden by InstantSearch.js. To set it, you want to use one of the filter widgets like refinementList or use the `configure` widget.
  additionalSearchParameters: {
    queryBy: "title,doc",
    filterBy: "package: [elixir,phoenix,ecto,plug]",
    sortBy: "_text_match(buckets: 10):desc,recent_downloads:desc",
  },
});
const { searchClient } = typesenseInstantsearchAdapter;

const search = instantsearch({
  searchClient,
  indexName: "hexdocs-full-text",
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item(item) {
        return `
        <div>
          <div>
            ${item._highlightResult.title.value}
          </div>
          <div>
            ${item._highlightResult.doc.value}
          </div>
        </div>
      `;
      },
    },
  }),
  instantsearch.widgets.pagination({
    container: "#pagination",
  }),
]);

search.start();
