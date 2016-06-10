/**
 * @param  {Observable} DOM
 * @param  {string}     selector
 * @return {Observable}
 */
export default function selectInput(DOM, selector) {
  return DOM.select(selector)
    .events("input")
    .map(event => event.target.value);
}
