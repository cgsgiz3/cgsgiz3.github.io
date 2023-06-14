import { units } from "./units.js";
import { plato } from "./plato.js";
import { Timer } from "./timer.js";
import { background } from "./background.js";

let drawunits = units();
drawunits.init = () => {
  background.init();
  plato.init();
};
drawunits.render = () => {
  gl.disable(gl.DEPTH_TEST);
  background.render();
  gl.enable(gl.DEPTH_TEST);
  plato.render();
  //window.requestAnimationFrame(drawunits.render);
  //window.requestAnimationFrame(drawunits.render);
  //window.requestAnimationFrame(drawunits.render);
};
export { drawunits };
