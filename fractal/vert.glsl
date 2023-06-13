#version 300 es
/* */
precision highp float;
in vec4 in_pos;


out vec2 color;
void main() 
{
  gl_Position = in_pos;
  color = in_pos.xy;
}