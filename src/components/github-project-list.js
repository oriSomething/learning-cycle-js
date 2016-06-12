import { Observable } from "rx";
import { a, div, img } from "@cycle/dom";


function intent({ HTTP, requestName }) {
  return HTTP
    .filter(res => res.request.name === requestName)
    .mergeAll()
    .map(res => JSON.parse(res.text).items)
    .startWith([]);
}

function model(intent$, limit) {
  return intent$
    .flatMapLatest(items => {
      const sorted = items.sort((x, y) => x.stargazers_count > y.stargazers_count);
      const sliced = sorted.slice(0, limit);
      return Observable.of(sliced);
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
 * @param {{ DOM: *, HTTP: *, requestName: string, limit: number }} sources
 * @return {{ DOM: * }} sinks
 */
export default function GithubProjectList({ HTTP, requestName, limit = 10 }) {
  return {
    DOM: view(model(intent({ HTTP, requestName }), limit)),
  };
}
