import { Observable } from "rx";
import { div, input } from "@cycle/dom";
import isolate from "@cycle/isolate";

const REQUEST_NAME = "github-search";

function GithubSearch({ DOM }) {
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
        return Observable.just({
          method: "get",
          url: `https://api.github.com/search/repositories?q=${value}`,
          name: REQUEST_NAME,
        });
      } else {
        return Observable.just({});
      }
    });
  /** @type {Observable} */
  const vtree$ = intent$.map((value) => {
    return div(".form-group", [
      input(".input.form-control", {
        type: "text",
        value,
      }),
    ]);
  });

  return {
    DOM: vtree$,
    HTTP: request$,
  };
}

export default function GithubSearchFactory() {
  return isolate(GithubSearch)(...arguments);
}

GithubSearchFactory.REQUEST_NAME = REQUEST_NAME;
