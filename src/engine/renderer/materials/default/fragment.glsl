precision mediump float;

uniform sampler2D   u_image;
varying vec3        v_image;

void main() {
    vec4 color = texture2D(u_image, v_image.xy);

    gl_FragColor = vec4(
        color.rgb, color.a * v_image.z
    );
}
