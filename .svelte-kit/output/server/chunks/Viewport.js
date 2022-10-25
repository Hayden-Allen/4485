import { c as create_ssr_component, d as add_attribute } from "./index.js";
const BORDER_SIZE = 1;
const Viewport = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { canvas = void 0 } = $$props;
  let { targetAspectRatio = void 0 } = $$props;
  let { onResize = void 0 } = $$props;
  let { focusable = false } = $$props;
  let containerWidth = void 0, containerHeight = void 0;
  if ($$props.canvas === void 0 && $$bindings.canvas && canvas !== void 0)
    $$bindings.canvas(canvas);
  if ($$props.targetAspectRatio === void 0 && $$bindings.targetAspectRatio && targetAspectRatio !== void 0)
    $$bindings.targetAspectRatio(targetAspectRatio);
  if ($$props.onResize === void 0 && $$bindings.onResize && onResize !== void 0)
    $$bindings.onResize(onResize);
  if ($$props.focusable === void 0 && $$bindings.focusable && focusable !== void 0)
    $$bindings.focusable(focusable);
  {
    {
      if (canvas && containerWidth && containerHeight) {
        const containerWidthMinusBorder = containerWidth - BORDER_SIZE * 2;
        const containerHeightMinusBorder = containerHeight - BORDER_SIZE * 2;
        if (targetAspectRatio) {
          const ratio = containerWidthMinusBorder / containerHeightMinusBorder;
          if (ratio < targetAspectRatio) {
            const width = Math.floor(containerWidthMinusBorder), height = Math.floor(containerWidthMinusBorder / targetAspectRatio);
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
          } else {
            const width = Math.floor(containerHeightMinusBorder * targetAspectRatio), height = Math.floor(containerHeightMinusBorder);
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
          }
        } else {
          const width = Math.floor(containerWidthMinusBorder), height = Math.floor(containerHeightMinusBorder);
          canvas.width = width * window.devicePixelRatio;
          canvas.height = height * window.devicePixelRatio;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
        }
        if (onResize) {
          onResize();
        }
      }
    }
  }
  return `<div class="${"w-full h-full flex items-center justify-center overflow-hidden"}"><canvas class="${"focus:outline-0 border border-transparent focus:border-neutral-300"}"${add_attribute("tabindex", focusable ? 0 : void 0, 0)}${add_attribute("this", canvas, 0)}></canvas></div>`;
});
export {
  Viewport as V
};
