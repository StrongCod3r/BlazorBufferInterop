using Microsoft.JSInterop;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.JavaScript;

namespace BlazorBufferInterop.Client
{
    public partial class BufferInterop
    {
        [JSImport("fillBuffer", "main")]
        internal static partial void FillBuffer(IntPtr ptr, int size);

        public static async Task RunAsync()
        {
            // Importar el módulo JavaScript
            await JSHost.ImportAsync("main", "../main.js");

            const int size = 1024;
            byte[] buffer = new byte[size];

            unsafe
            {
                fixed (byte* ptr = buffer)
                {
                    FillBuffer((IntPtr)ptr, size);
                }
            }

            Console.WriteLine($"Primeros bytes: {string.Join(", ", buffer[..8])}");
        }

        public static async Task DrawGradientAsync(IJSRuntime jsRuntime, string canvasId, int width, int height)
        {
            // Importar el módulo primero
            await JSHost.ImportAsync("main", "../main.js");

            // Cargar el módulo JS
            var module = await jsRuntime.InvokeAsync<IJSObjectReference>("import", "../main.js");

            // Buffer RGBA: 4 bytes por pixel
            int bufferSize = width * height * 4;
            byte[] buffer = new byte[bufferSize];

            // Usar GCHandle para mantener el buffer fijado durante las llamadas async
            GCHandle handle = GCHandle.Alloc(buffer, GCHandleType.Pinned);

            try
            {
                long ptrValue = handle.AddrOfPinnedObject().ToInt64();

                // Llamar a las funciones JS
                await module.InvokeVoidAsync("fillBufferWithGradient", ptrValue, width, height);
                await module.InvokeVoidAsync("drawBufferToCanvas", canvasId, ptrValue, width, height);

                Console.WriteLine("Imagen dibujada exitosamente en el canvas");
            }
            finally
            {
                // Siempre liberar el handle
                if (handle.IsAllocated)
                    handle.Free();
            }
        }
    }
}
