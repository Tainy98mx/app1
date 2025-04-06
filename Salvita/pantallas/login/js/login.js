/**
 * Script para manejar la funcionalidad de la pantalla de inicio de sesión
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const formularioLogin = document.getElementById('formularioLogin');
    const campoCredencial = document.getElementById('credencial');
    const campoContrasena = document.getElementById('contrasena');
    const botonMostrarContrasena = document.getElementById('mostrarContrasena');
    const checkboxMantenerSesion = document.getElementById('mantenerSesion');
    const mensajeAlerta = document.getElementById('mensajeAlerta');
    const errorCredencial = document.getElementById('errorCredencial');
    const errorContrasena = document.getElementById('errorContrasena');
    const enlaceOlvidoContrasena = document.getElementById('olvidoContrasena');

    // Función para mostrar/ocultar contraseña
    botonMostrarContrasena.addEventListener('click', function() {
        if (campoContrasena.type === 'password') {
            campoContrasena.type = 'text';
            botonMostrarContrasena.textContent = 'Ocultar';
        } else {
            campoContrasena.type = 'password';
            botonMostrarContrasena.textContent = 'Mostrar';
        }
    });

    // Prevenir envío de formulario si hay errores
    formularioLogin.addEventListener('submit', async function(evento) {
        evento.preventDefault();
        
        // Limpiar mensajes de error anteriores
        errorCredencial.textContent = '';
        errorContrasena.textContent = '';
        mensajeAlerta.classList.remove('oculto', 'error', 'exito');
        mensajeAlerta.classList.add('cargando');
        mensajeAlerta.textContent = 'Verificando credenciales...';
        
        // Validar campos
        let esValido = true;
        
        if (!campoCredencial.value.trim()) {
            errorCredencial.textContent = 'Ingrese su correo o número telefónico';
            esValido = false;
        }
        
        if (!campoContrasena.value) {
            errorContrasena.textContent = 'Ingrese su contraseña';
            esValido = false;
        }
        
        if (esValido) {
            try {
                // Intentar autenticar al usuario (proceso asíncrono)
                const resultado = await baseDatos.autenticarUsuario(
                    campoCredencial.value.trim(),
                    campoContrasena.value,
                    checkboxMantenerSesion.checked
                );
                
                if (resultado.exito) {
                    // Mostrar mensaje de éxito
                    mensajeAlerta.classList.remove('oculto', 'error', 'cargando');
                    mensajeAlerta.classList.add('exito');
                    mensajeAlerta.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
                    
                    // Registrar en consola el usuario autenticado
                    console.log(`Usuario autenticado: ${resultado.usuario.nombre} (ID: ${resultado.usuario.id})`);
                    
                    // Redirigir al dashboard después de un breve retraso
                    setTimeout(function() {
                        window.location.href = '../dashboard/dashboard.html';
                    }, 1500);
                } else {
                    // Mostrar mensaje de error
                    mensajeAlerta.classList.remove('oculto', 'exito', 'cargando');
                    mensajeAlerta.classList.add('error');
                    mensajeAlerta.textContent = resultado.mensaje || 'Credenciales incorrectas. Intente nuevamente.';
                }
            } catch (error) {
                console.error('Error en la autenticación:', error);
                
                // Mostrar mensaje de error
                mensajeAlerta.classList.remove('oculto', 'exito', 'cargando');
                mensajeAlerta.classList.add('error');
                mensajeAlerta.textContent = 'Error interno al verificar credenciales. Intente nuevamente.';
            }
        } else {
            // Si hay errores de validación, ocultar el mensaje de carga
            mensajeAlerta.classList.add('oculto');
        }
    });
    
    // Manejar el enlace de "Olvidé mi contraseña"
    enlaceOlvidoContrasena.addEventListener('click', function(evento) {
        evento.preventDefault();
        
        // Como no se implementa la recuperación de contraseña, mostramos un mensaje
        mensajeAlerta.classList.remove('oculto', 'exito');
        mensajeAlerta.classList.add('error');
        mensajeAlerta.textContent = 'Funcionalidad de recuperación de contraseña no implementada.';
    });

    // Efectos visuales para mejorar la experiencia de usuario
    const camposEntrada = document.querySelectorAll('input');
    
    camposEntrada.forEach(campo => {
        // Efecto al enfocar un campo
        campo.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'all 0.3s ease';
        });
        
        // Restaurar al quitar el foco
        campo.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});
