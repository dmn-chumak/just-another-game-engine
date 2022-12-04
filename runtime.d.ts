/**
 * WebAssembly typedefs
 */

declare type double = number;
declare type float  = number;
declare type long   = number;
declare type int    = number;
declare type short  = number;
declare type byte   = number;
declare type char   = string;

/**
 * WebGL typedefs
 */

declare type WebGLAttribLocation = GLint;

/**
 * Utils typedefs
 */

declare type Class<Type> = { new(...args:Vector<any>):Type; };
declare type DictionaryKeys = int | string;
declare type Dictionary<Type> = { [Key in DictionaryKeys]: Type };
declare type Vector<Type> = Type[];

/**
 * Errors handler
 */

declare interface ErrorMessage {
    message?:string;
    stackTrace?:string;
    source?:string;
    line?:number;
    column?:number;
}

declare interface Window {
    ERRORS_HANDLER(error:ErrorMessage):void;
    USER_DATA:any;
}

/**
 * Raw-loader typedefs
 */

declare var require: {
    <T>(path: string): T;
};
