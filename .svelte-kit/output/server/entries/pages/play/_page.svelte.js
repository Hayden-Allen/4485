import { c as create_ssr_component, v as validate_component } from "../../../chunks/index.js";
import { V as Viewport } from "../../../chunks/Viewport.js";
import "matter-js";
const Game_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let canvas = void 0;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Viewport, "Viewport").$$render(
      $$result,
      { canvas },
      {
        canvas: ($$value) => {
          canvas = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Game_1, "Game").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
