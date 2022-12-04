export class ShaderUtil {
    public static attachName(name:string, source:string):string {
        return `#define SHADER_NAME ${ name }\n\n${ source }`;
    }
}
