#version 300 es
/* */
precision highp float;
in vec4 in_pos;


out vec2 color;
uniform vec3 position;
void main() 
{
  gl_Position = vec4((in_pos.xy * position.z - position.xy), 0, 1);;
  color = in_pos.xy;
}