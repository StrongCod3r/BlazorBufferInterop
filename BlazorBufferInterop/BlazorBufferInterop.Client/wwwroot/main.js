export function fillBuffer(ptr, size) {
    // En .NET 10, accedemos a la memoria WASM directamente a través de Module.HEAPU8
    const runtime = globalThis.getDotnetRuntime(0);
    const bytes = new Uint8Array(runtime.Module.HEAPU8.buffer, ptr, size);
    
    for (let i = 0; i < size; i++) {
      bytes[i] = i % 256;
    }
    
    console.log("JS filled buffer:", bytes.slice(0, 8));
}

export function drawBufferToCanvas(canvasId, ptr, width, height) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error("Canvas not found:", canvasId);
        throw new Error(`Canvas con id '${canvasId}' no encontrado`);
    }
    
    const ctx = canvas.getContext('2d');
    const runtime = globalThis.getDotnetRuntime(0);
    
    // El buffer contiene datos RGBA (4 bytes por pixel)
    const bufferSize = width * height * 4;
  const bytes = new Uint8Array(runtime.Module.HEAPU8.buffer, ptr, bufferSize);
    
    // Crear ImageData desde el buffer
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(bytes);
    
    // Dibujar en el canvas
    ctx.putImageData(imageData, 0, 0);
    
    console.log("Canvas dibujado exitosamente");
}

export function fillBufferWithGradient(ptr, width, height) {
    const runtime = globalThis.getDotnetRuntime(0);
    const bufferSize = width * height * 4; // RGBA
    const bytes = new Uint8Array(runtime.Module.HEAPU8.buffer, ptr, bufferSize);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
      
     // Crear un gradiente de colores
   bytes[index + 0] = (x / width) * 255;      // Red
            bytes[index + 1] = (y / height) * 255;     // Green
      bytes[index + 2] = 128;        // Blue
            bytes[index + 3] = 255;         // Alpha (opacidad)
        }
 }
    
    console.log("Buffer llenado con gradiente");
}
