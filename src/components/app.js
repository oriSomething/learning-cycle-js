import { Observable } from "rx";
import { div, h1 } from "@cycle/dom";
import Input from "./input";

/**
 * @param {{ DOM: * }} sources
 * @return {{ DOM: * }} sinks
 */
export default function App({ DOM }) {
  /** @type {Observable} */
  const inputA$ = Input({ DOM });
  /** @type {Observable} */
  const vtree$ = Observable.combineLatest(inputA$.DOM, inputA$.value$)
    .map(([inputAVTree, value]) => {
      return (
        div(".container", [
          div(".row", [
            div(".col-xs", [
              inputAVTree,
              h1("", String(value)),
            ]),
          ]),
        ])
      );
    });

  return {
    DOM: vtree$,
  };
}
