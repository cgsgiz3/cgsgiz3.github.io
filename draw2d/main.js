import { Timer } from "./timer.js";
let gl;
let fs, vs;
let frag = `#version 300 es
/* */
precision highp float;
out vec4 out_color;
uniform float time;
uniform vec2 r;
void main()
{   
  vec2 p = (gl_FragCoord.xy * 2.0 - r) / r;
  vec3 rColor = vec3(0.9, 0.101, 0.3);
  vec3 gColor = vec3(0.3, 0.101, 0.9);
  vec3 bColor = vec3(0.9, 0.901, 0.0);

  float a = p.x * p.x + p.y * p.y - (sin(time * 0.2) + 1.0) / 2.0;	
  float f = abs(a);  
  float b = p.x * p.x + p.y * p.y - (cos(time * 0.2 * 3.14) + 1.0) / 2.0;	
  float g = abs(b);
  float s = sin(p.x * 3.14 + time);
  float si = s + p.y;

  float len = length(p); //cos(len * 3.14)
  float rad = 0.1;
  float lenx = mod(len, rad);
  float leny = abs(p.x) * abs(p.y);//mod(p.y, 0.01);
  float lenxy = abs(p.x * cos(time) - p.y * sin(time)) - abs(p.x * sin(a) + p.y * cos(time));

  vec3 destColor = bColor * 0.01 / abs(si * len * len) + gColor * 0.0003 / abs(leny) + rColor * lenxy * lenxy;
  out_color = vec4(destColor, 1);
}`;
let vert = `#version 300 es
/* */
precision highp float;
in vec4 in_pos;
void main() 
{
  gl_Position = vec4(in_pos.xy, 0, 1);
}`;
function loadShader(type, source) 
{
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}
function createShaderProgram()
{
  const vertexShader = loadShader(gl.VERTEX_SHADER, vs.value);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fs.value);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return false;
  }
  return shaderProgram;
}
export function initGL() 
{
  const canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");
  const pos = [-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0];
  let shaderProgram;
  fs = document.getElementById("fs");
  vs = document.getElementById("vs");
  if (!localStorage.getItem("fs"))
  {
    localStorage.setItem('fs', frag);
    localStorage.setItem('vs', vert);
  }
  fs.value = localStorage.getItem("fs");
  vs.value = localStorage.getItem("vs");
  document.getElementById("save").onclick = () => {
    localStorage.setItem('fs', fs.value);
    localStorage.setItem('vs', vs.value);
  };
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  shaderProgram = createShaderProgram();
  const posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posLoc);
  fs.oninput = () => 
  {
    let prg = createShaderProgram();
    if (prg)
    {
      shaderProgram = prg;
      const posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);
    }
  }
  vs.oninput = () => 
  {
    let prg = createShaderProgram();
    if (prg)
    {
      shaderProgram = prg;
      const posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);
    }
  }
  const draw = () => 
  {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    Timer.response("fps");
    gl.useProgram(shaderProgram);
    let informLoc = gl.getUniformLocation(shaderProgram, "time");
    gl.uniform1f(informLoc, Timer.localTime);
    informLoc = gl.getUniformLocation(shaderProgram, "r");
    gl.uniform2fv(informLoc, [canvas.width, canvas.height]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimationFrame(draw);
  };
  draw();
}
