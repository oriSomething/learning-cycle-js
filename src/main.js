import { run } from "@cycle/core";
import { makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import App from "./components/app";

const drivers = {
  DOM: makeDOMDriver("#main"),
  HTTP: makeHTTPDriver(),
};

run(App, drivers);
