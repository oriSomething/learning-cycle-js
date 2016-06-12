import { Observable } from "rx";
import { div, input } from "@cycle/dom";
import isolate from "@cycle/isolate";
import _ from "lodash";

/**
 * @param {{ DOM: * }} sources
 * @return {{ DOM: *, HTTP: *, requestName: string }}
 */
function GithubSearch({ DOM }) {
  /** @type {String} */
  const requestName = `github-search-${_.uniqueId()}`;
  /** @type {Observable} */
  const intent$ = DOM.select(".input")
    .events("input")
    .map(e => e.target.value)
    .map(value => value || "")
    .startWith("");
  /** @type {Observable} */
  const request$ = intent$
    .debounce(250)
    .flatMap(value => {
      if (value) {
        return Observable.of({
          url: `https://api.github.com/search/repositories`,
          query: {
            q: value,
          },
          name: requestName,
        });
      } else {
        return Observable.of({});
      }
    });
  /** @type {Observable} */
  const vtree$ = intent$.map((value) => {
    return div(".form-group", [
      input(".input.form-control", {
        placeholder: "search for github project",
        type: "text",
        value,
      }),
    ]);
  });

  return {
    DOM: vtree$,
    HTTP: request$,
    requestName,
  };
}

export default function GithubSearchFactory() {
  return isolate(GithubSearch)(...arguments);
}
