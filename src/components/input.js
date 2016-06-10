import { div, input } from "@cycle/dom";
import isolate from "@cycle/isolate";

function Input({ DOM }) {
  /** @type {Observable} */
  const intent$ = DOM.select(".input")
    .events("input")
    .map(e => e.target.value)
    .map(value => Number(value) || 0)
    .startWith(0);
  /** @type {Observable} */
  const vtree$ = intent$.map((value) => {
    return div(".form-group", [
      input(".input.form-control", {
        type: "number",
        value: String(value),
      }),
    ]);
  });

  return {
    DOM: vtree$,
    value$: intent$,
  };
}

export default function() {
  return isolate(Input)(...arguments);
}
