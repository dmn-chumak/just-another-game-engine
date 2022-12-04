uniform mat4    u_worldMatrix;

attribute vec3  a_imageXY;
attribute vec2  a_vertexesXY;
attribute vec3  a_imageUV;

varying vec3    v_image;

void main() {
    float offsetX = a_vertexesXY.x * cos(a_imageXY.z) - a_vertexesXY.y * sin(a_imageXY.z);
    float offsetY = a_vertexesXY.x * sin(a_imageXY.z) + a_vertexesXY.y * cos(a_imageXY.z);

    vec2 position = a_imageXY.xy + vec2(offsetX, offsetY);
    gl_Position = u_worldMatrix * vec4(position, 0, 1);

    v_image = a_imageUV;
}
