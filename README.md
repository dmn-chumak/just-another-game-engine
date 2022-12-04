# Just Another Game Engine

Implementation of a rendering system from a simple game engine, with built-in material batching support on top of WebGL.
Don't be scared of **runtime.d.ts**, it was planned to port engine code to C++/WebAssembly later.

```typescript
System.initialize('#wrapper');
System.stage.appendChild(new Bitmap(null));
// and so on...
```
