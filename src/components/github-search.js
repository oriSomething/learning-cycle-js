import { Observable } from "rx";
import { div, input } from "@cycle/dom";
import isolate from "@cycle/isolate";
import _ from "lodash";

/**
 * @param {{ DOM: *, HTTP: * }} sources
 * @return {{ DOM: *, HTTP: *, items$: Observable.<*[]> }}
 */
function GithubSearch({ DOM, HTTP }) {
  const inputOnInput$ = DOM.select(".input")
    .events("input")
    .map(e => e.target.value)
    .startWith(null);

  const inputOnInputDebounced$ = inputOnInput$.debounce(250);

  const requestName$ = inputOnInputDebounced$
    .map(__ => `github-search-${_.uniqueId()}`)
    .shareReplay(1);

  const intentHTTP$ = requestName$
    .flatMap(requestName => HTTP.filter(response => response.request.name === requestName))
    .mergeAll()
    .startWith(null)
    .shareReplay(1);

  const vtree$ = Observable.combineLatest(inputOnInput$, requestName$, intentHTTP$, (value, requestName, response) => {
    const isFirst = (!value) && response == null;
    const isLoading = !isFirst && (response == null || (response.request.name !== requestName));

    let items = [];
    if (!(isFirst || isLoading)) {
      items = JSON.parse(response.text).items;
    }

    return div(".form-group", [
      input(".input.form-control", {
        placeholder: "search for github project",
        type: "text",
        value,
      }),
      (isLoading || isFirst ?
          div([isFirst ? "" : "loading…"]) :
          div([`${items.length} items`])
      ),
    ]);
  });

  const requestHTTP$ = Observable.combineLatest(inputOnInputDebounced$, requestName$)
    .filter(([value]) => Boolean(value))
    .map(([value, requestName]) => Observable.of({
      url: "https://api.github.com/search/repositories",
      query: {
        q: value,
      },
      name: requestName,
    }))
    .flatMap(_.identity);

  const items$ = intentHTTP$
    .filter(_.isObject)
    .map(response => JSON.parse(response.text).items)
    .startWith([]);

  return {
    DOM: vtree$,
    HTTP: requestHTTP$,
    items$,
  };
}

export default function GithubSearchFactory() {
  return isolate(GithubSearch)(...arguments);
}
