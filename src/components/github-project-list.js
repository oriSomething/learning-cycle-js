import _ from "lodash";
import { Observable } from "rx";
import { a, div, img } from "@cycle/dom";

function model(intent$, limit) {
  return intent$
    .flatMapLatest(items => {
      const itemsSorted = _.chain(items)
        .sortBy("stargazers_count")
        .reverse()
        .slice(0, limit)
        .value();

      return Observable.of(itemsSorted);
    });
}

function view(model$) {
  return model$
    .map(items => {
      return div(".col-xs", [
        div(".row", items.map(item => {
          return div(".col-sm-4", [
            div(".card.text-sm-center", [
              img(".card-img-top", {
                src: item.owner.avatar_url,
                width: "100",
                height: "100",
              }),
              div(".card-block", [
                a({
                  href: item.html_url,
                }, [item.name]),
              ]),
            ]),
          ]);
        })),
      ]);
    })
    .startWith(div());
}

/**
 * @param {{ items$: Observable<*[]>, limit: number }} sources
 * @return {{ DOM: * }} sinks
 */
export default function GithubProjectList({ items$, limit = 10 }) {
  return {
    DOM: view(model(items$, limit)),
  };
}
