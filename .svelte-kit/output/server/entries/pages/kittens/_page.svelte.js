import { c as create_ssr_component, d as add_attribute } from "../../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let createKittenName = "Test Kitten";
  return `<input${add_attribute("value", createKittenName, 0)}>
<button>Spawn a Kitten</button>`;
});
export {
  Page as default
};
