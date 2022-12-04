uniform mat4    u_worldMatrix;

attribute vec2  a_imageXY;
attribute vec3  a_imageUV;

varying vec3    v_image;

void main() {
    gl_Position = u_worldMatrix * vec4(a_imageXY.xy, 0, 1);
    v_image = a_imageUV;
}
