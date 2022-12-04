precision mediump float;

#define SHADOW_COLOR    vec3(0.0)
#define SHADOW_DELTA    4.0

uniform sampler2D   u_image;
uniform vec2        u_screenScale;
uniform vec4        u_color;

varying vec3        v_image;

void main() {
    float textDistance = texture2D(u_image, v_image.xy).a;
    float textAlpha = smoothstep(0.35, 0.55, textDistance);
    vec4 textColor = vec4(u_color.rgb, u_color.a * textAlpha * v_image.z);

    vec2 shadowOffset = SHADOW_DELTA / u_screenScale;
    float shadowDistance = texture2D(u_image, v_image.xy - shadowOffset).a;
    float shadowAlpha = smoothstep(0.25, 0.55, shadowDistance);
    vec4 shadowColor = vec4(SHADOW_COLOR, shadowAlpha * v_image.z);

    gl_FragColor = mix(shadowColor, textColor, textColor.a);
}
