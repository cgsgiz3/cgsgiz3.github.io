export function func() {
  console.log("123");
}

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
  Mouseobj.x = 0.0;
  Mouseobj.y = 0.0;
  Mouseobj.wheel = 1.0;
}
export function initGL(Timer) {
  //debugger;
  let vs, fs;

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

  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

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
    const pos = [-x, -x, 0, -x, x, 0, x, -x, 0, x, x, 0];
    const index = new Uint16Array([1, 0, 2, 3]);
    const indexbuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexbuf);
    const draw = () => {
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
      gl.uniform1f(informLoc, Timer.LocalTime);
      informLoc = gl.getUniformLocation(shaderProgram, "position");
      //Mouseobj.wheel = parseFloat(document.getElementById("myRange").value);
      gl.uniform3f(informLoc, Mouseobj.x, Mouseobj.y, Mouseobj.wheel);
      /* Блок о uniform buffer*/

      // Vertex array/buffer
      /*
      gl.useProgram(shaderProgram);
      let frameBuffer = gl.createBuffer();
      let frameUniformBufferIndex = 0;
      gl.bindBuffer(gl.UNIFORM_BUFFER, frameBuffer);
      let buf = new Float32Array([
        1.3727254, -0.81649661, -0.57773525, -0.57735026, 0.0, 1.6329932,
        -0.57773525, -0.57735026, -1.3727254, -0.81649661, -0.57773525,
        -0.57735026, 0.0, 0.0, 13.66558, 13.856406,
      ]);
      gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(buf), gl.STATIC_DRAW);
      gl.uniformBlockBinding(
        shaderProgram,
        gl.getUniformBlockIndex(shaderProgram, "frameBuffer"),
        frameUniformBufferIndex
      );
      gl.bindBufferBase(
        gl.UNIFORM_BUFFER,
        frameUniformBufferIndex,
        frameBuffer
      );
      */
      //gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexbuf);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.UNSIGNED_SHORT, 4);
      window.requestAnimationFrame(draw);
    };
    draw();
  });
}
export function MouseCoordination(event) {}
export function MouseMove(event, key) {
  if (event === 0 || !key) {
    Mouseobj.x1 = Mouseobj.x;
    Mouseobj.y1 = Mouseobj.y;
    return;
  }
  if (key) {
    Mouseobj.x =
      Mouseobj.x1 -
      ((event.clientX / gl.canvas.width) * 2.0 - 1.0) * Mouseobj.wheel;
    Mouseobj.y =
      Mouseobj.y1 -
      ((event.clientY / gl.canvas.height) * 2.0 - 1.0) * Mouseobj.wheel;
  }
}
export function MouseWheel(event, key) {
  ///*

  if (key) {
    Mouseobj.wheel += 0.125;
  } else {
    if (Mouseobj.wheel > 0.125) {
      Mouseobj.wheel -= 0.025;
    } else {
      let k = 0.025;

      while (true) {
        if (Mouseobj.wheel < k + k / 10.0) {
          k = k / 1.5;
        } else {
          break;
        }
        if (k < 0.000000025) {
          k = k / 5.0;
        }
      }
      Mouseobj.wheel -= k;
    }
  }
  Mouseobj.x +=
    ((event.clientX / gl.canvas.width) * 2.0 - 1.0) * Mouseobj.wheel;
  Mouseobj.y +=
    ((event.clientY / gl.canvas.height) * 2.0 - 1.0) * Mouseobj.wheel;

  event.preventDefault();
}
