import { Observable } from "rx";
import { a, div, img, hr, p } from "@cycle/dom";


function view(items, limit) {
  return Observable.of(items)
    .map(items => items.sort((x, y) => x.stargazers_count > y.stargazers_count))
    .flatMap(items => Observable.from(items))
    .filter(item => Boolean(item))
    .map(item => {
      return div(".col-xs", [
        a({
          href: item.html_url,
        }, [
          p([item.name]),
          img({
            src: item.owner.avatar_url,
            width: "100",
            height: "100",
          }),
          hr(),
        ]),
      ]);
    })
    .scan((x, y) => [...x, y], [])
    .take(limit);
}

export default function GithubProjectList({ items$, limit = 10 }) {
  const vtree$ = items$
    .flatMapLatest(items => view(items, limit))
    .startWith([]);

  return {
    DOM: vtree$,
  };
}
