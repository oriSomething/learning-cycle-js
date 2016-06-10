import { run } from "@cycle/core";
import { makeDOMDriver } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { rerunner, restartable } from "cycle-restart";
import App from "./components/app";

const domDriver = makeDOMDriver("#main");

/** hot reloading magic */
if (typeof module !== "undefined" && module.hot) {
  const drivers = {
    /** @type {*} For hot reload */
    DOM: restartable(domDriver, {
      pauseSinksWhileReplaying: false,
    }),
  };

  const rerun = rerunner(run, isolate);
  rerun(App, drivers);

  module.hot.accept("./components/app", () => {
    const App = require("./components/app")["default"];
    rerun(App, drivers);
  });
} else {
  /** Without hot reloading */
  const drivers = {
    DOM: domDriver,
  };

  run(App, drivers);
}
