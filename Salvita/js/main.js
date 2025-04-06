// Script principal para la aplicación Salvita

document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación Salvita iniciada correctamente');
    
    // Verificar si el usuario ya ha iniciado sesión
    const usuarioActual = localStorage.getItem('usuarioActual');
    
    // Si hay un usuario con sesión activa, mostrar mensaje de bienvenida
    if (usuarioActual) {
        try {
            const datosUsuario = JSON.parse(usuarioActual);
            
            // Si estamos en la página principal y hay un usuario con sesión activa, 
            // mostramos un mensaje de bienvenida personalizado
            if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
                const tarjetaBienvenida = document.querySelector('.tarjeta-bienvenida');
                
                if (tarjetaBienvenida) {
                    const titulo = tarjetaBienvenida.querySelector('h1');
                    if (titulo) {
                        titulo.textContent = `Bienvenido de nuevo, ${datosUsuario.nombre}`;
                    }
                    
                    const botones = tarjetaBienvenida.querySelector('.botones');
                    if (botones) {
                        botones.innerHTML = `
                            <a href="#" class="boton-principal" id="irPrincipal">Continuar a mi cuenta</a>
                            <a href="#" class="boton-secundario" id="cerrarSesion">Cerrar sesión</a>
                        `;
                        
                        // Agregar evento para cerrar sesión
                        document.getElementById('cerrarSesion').addEventListener('click', function(e) {
                            e.preventDefault();
                            localStorage.removeItem('usuarioActual');
                            window.location.reload();
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error al procesar datos del usuario:', error);
            localStorage.removeItem('usuarioActual');
        }
    }
});
