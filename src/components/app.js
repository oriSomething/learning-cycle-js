import { Observable } from "rx";
import { div } from "@cycle/dom";
import GithubSearch from "./github-search";
import GithubProjectList from "./github-project-list";

/**
 * @param {{ DOM: *, HTTP: * }} sources
 * @return {{ DOM: *, HTTP: * }} sinks
 */
export default function App({ DOM, HTTP }) {
  const githubSearch$ = GithubSearch({ DOM, HTTP });

  const githubProjectList$ = GithubProjectList({
    HTTP,
    items$: githubSearch$.items$,
  });

  const vtree$ = Observable.combineLatest(githubSearch$.DOM, githubProjectList$.DOM)
    .map(([githubSearchVTree, githubProjectList]) => {
      return (
        div(".container", [
          div(".row", [
            div(".col-xs", [
              githubSearchVTree,
            ]),
            githubProjectList,
          ]),
        ])
      );
    });

  return {
    DOM: vtree$,
    HTTP: githubSearch$.HTTP,
  };
}
