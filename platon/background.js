/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
import { units } from "./units.js";
import { Camera } from "/camera.js";
import { GetN, vec3 } from "./math.js";
import { Timer } from "./timer.js";
import { mtlCreate } from "./material.js";
import { unitcreateprimitive } from "./units.js";

let background = {};
background.init = () => {
  background.a1 = {};
  background.a1.file = "./background";
  background.a1.idCanvas = "glCanvas";
  background.a1.type = "tristrip";
  background.a1.texture = { Tex1: "plato.png" };
  //background.a1.texture = {
  //  Tex1: "create_frameBuffer(gl.canvas.width, gl.canvas.width)",
  //};
  const pos = [-1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1];
  const tex = [0, 0, 0, 1, 1, 0, 1, 1];
  background.a1.buffer = {
    in_pos: pos,
    in_tex: tex,
  };
  background.a1.uniform = {
    texBuffer: () => {
      return [
        Timer.localTime,
        Timer.globalDeltaTime,
        background.a1.texture.Tex1.value,
        1,
      ];
    },
  };
  unitcreateprimitive(background.a1);
};
background.render = () => {
  background.a1.draw();
};
export { background };
