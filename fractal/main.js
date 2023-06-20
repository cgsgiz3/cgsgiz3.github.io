import { Timer } from "./timer.js";
let gl,
  Mouseobj = {};
function LoadShader(type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("!!!");
  }
  return shader;
}
export function Init() {
  Mouseobj.x = 0.005825434453427562;
  Mouseobj.y = -0.03498725821777998;
  Mouseobj.z = 0.41225084020439956;
  Mouseobj.eventX = 0.0;
  Mouseobj.eventY = 0.0;
  Mouseobj.deltaeventX = 0.0;
  Mouseobj.deltaeventY = 0.0;
}
const pos = [-5, -5, 0, -5, 5, 0, 5, -5, 0, 5, 5, 0];
export function initGL() {
  //debugger;
  let vs, fs;
  Init();

  // Запрос на загрузку первого файла
  const ft1 = fetch("./vert.glsl")
    .then((res) => res.text()) // Стрелочная безымянная функция запустится после получение текста, из 'res' получаем текстовые данные
    .then((data) => {
      // Стрелочная безымянная функция запустится для обработки полученных на предыдущем этапе данных - 'data' это полученный текст
      vs = data; // Запоминаем полученный текст в глобальной переменной
    });
  const ft2 = fetch("./frag.glsl")
    .then((res) => res.text())
    .then((data) => {
      fs = data;
    });

  const canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");

  // Построение "промиза" - сущности ожидания завершения указанных асинхронных запросов
  const allData = Promise.all([ft1, ft2]);
  allData.then((res) => {
    // Вызов произойдет, когда все запросы выполнятся
    // Выполняем то, что необходимо после получения файлов
    const vertexShader = LoadShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = LoadShader(gl.FRAGMENT_SHADER, fs);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const Buf = gl.getProgramInfoLog(shaderProgram);
      console.log(Buf);
      alert("!!!!");
    }
    const posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    const x = 1;

    const index = new Uint16Array([1, 0, 2, 3]);
    const indexbuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexbuf);
    const draw = () => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      Timer.response("fps");
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(index),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);
      gl.useProgram(shaderProgram);
      let informLoc = gl.getUniformLocation(shaderProgram, "time");
      gl.uniform1f(informLoc, Timer.localTime);
      informLoc = gl.getUniformLocation(shaderProgram, "IsJulia");
      if (document.getElementById("IsJulia").checked)
        gl.uniform1f(informLoc, 1);
      else {
        gl.uniform1f(informLoc, 0);
      }
      informLoc = gl.getUniformLocation(shaderProgram, "position");
      gl.uniform3f(informLoc, Mouseobj.x, Mouseobj.y, Mouseobj.z);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexbuf);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.UNSIGNED_SHORT, 4);
      window.requestAnimationFrame(draw);
    };
    draw();
  });
}
let first = true;
export function MouseMove(event) {
  if (first) {
    Mouseobj.eventX = event.clientX;
    Mouseobj.eventY = event.clientY;
    first = false;
  }
  if (event.buttons === 1) {
    Mouseobj.deltaeventX = event.clientX - Mouseobj.eventX;
    Mouseobj.deltaeventY = event.clientY - Mouseobj.eventY;
    let px = ((Mouseobj.deltaeventX * 2.0) / gl.canvas.width) * 1.0;
    let py = ((Mouseobj.deltaeventY * 2.0) / gl.canvas.height) * 1.0;
    Mouseobj.x = Mouseobj.x - px;
    Mouseobj.y = Mouseobj.y + py;
  }
  Mouseobj.eventX = event.clientX;
  Mouseobj.eventY = event.clientY;
}
export function MouseWheel(event) {
  let k = 1;
  if (event.deltaY < 0) {
    k = 1.025;

    //if (Mouseobj.z < 0.125) {
    //  while (true)
    //  {
    //    if (Mouseobj.z < k + k / 10.0) {
    //      k = k / 1.5;
    //    } else {
    //      break;
    //    }
    //    if (k < 0.000000025) {
    //      k = k / 5.0;
    //    }
    //  }
    //}
  } else {
    k = 0.975;

    //while (Mouseobj.z < z)
    //{
    //  z = z / 2;
    //  k = k / 1;
    //}
    //if (Mouseobj.z > 0.825) {
    //  while (true) {
    //    if (Mouseobj.z > k + k * 10.0) {
    //      k = k * 1.5;
    //    } else {
    //      break;
    //    }
    //    if (k < 0.000000025) {
    //      k = k * 5.0;
    //    }
    //  }
    //}
  }
  let px = ((event.clientX * 1.0) / gl.canvas.width) * 1.0 * 2.0 - 1.0;
  let py = ((event.clientY * 1.0) / gl.canvas.height) * 1.0 * 2.0 - 1.0;
  Mouseobj.z = Mouseobj.z * k;
  Mouseobj.x = Mouseobj.x * k - px * (1 - k);
  Mouseobj.y = Mouseobj.y * k + py * (1 - k);
}
//Mouseobj.x = Mouseobj.x * k + px * (1 - k);//Mouseobj.x * k + px * (1 - k);
//Mouseobj.y = Mouseobj.y * k + py * (1 - k);//Mouseobj.y * k + py * (1 - k);

//let px = (event.clientY * 1.0 / gl.canvas.height * 1.0) * 2.0 - 1.0;
//let py = (event.clientY * 1.0 / gl.canvas.height * 1.0) * 2.0 - 1.0;
//if (px > 0)
//{
//  Mouseobj.x = Mouseobj.x * k + Math.abs(px) * (1 - k);
//} else
//{
//  Mouseobj.x = Mouseobj.x * k + Math.abs(px) * (k - 1);
//}
//if (py > 0)
//{
//  Mouseobj.y = Mouseobj.y * k + Math.abs(py) * (1 - k);
//}else
//{
//  Mouseobj.y = Mouseobj.y * k + Math.abs(py) * (k - 1);
//}
