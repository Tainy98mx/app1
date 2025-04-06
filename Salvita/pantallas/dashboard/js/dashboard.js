/**
 * Script para manejar la funcionalidad del Dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const nombreUsuarioElement = document.getElementById('nombreUsuario');
    const botonNotificaciones = document.getElementById('botonNotificaciones');
    const botonAjustes = document.getElementById('botonAjustes');
    const menuNotificaciones = document.getElementById('menuNotificaciones');
    const menuAjustes = document.getElementById('menuAjustes');
    const enlaceCerrarSesion = document.getElementById('enlaceCerrarSesion');
    const enlaceDatosUsuario = document.getElementById('enlaceDatosUsuario');
    const botonesNav = document.querySelectorAll('.boton-nav');
    const botonChat = document.querySelector('.boton-chat');
    
    // Verificar si hay una sesión activa
    const usuarioActual = baseDatos.verificarSesion();
    
    if (usuarioActual && usuarioActual.nombre) {
        // Actualizar el nombre del usuario en la interfaz
        nombreUsuarioElement.textContent = usuarioActual.nombre.split(' ')[0]; // Solo el primer nombre
        console.log(`Dashboard inicializado correctamente`);
    } else {
        // Si no hay sesión activa o hay datos incompletos, redirigir al inicio de sesión
        console.error('No se encontró información de sesión válida');
        localStorage.removeItem('usuarioActual'); // Limpiar para evitar problemas futuros
        window.location.href = '../login/login.html';
        return; // Detener la ejecución del script
    }
    
    // Manejar el botón de notificaciones
    botonNotificaciones.addEventListener('click', function(evento) {
        evento.stopPropagation(); // Evitar que el clic se propague al documento
        menuNotificaciones.classList.toggle('oculto');
        menuAjustes.classList.add('oculto'); // Cerrar el otro menú si está abierto
    });
    
    // Manejar el botón de ajustes
    botonAjustes.addEventListener('click', function(evento) {
        evento.stopPropagation(); // Evitar que el clic se propague al documento
        menuAjustes.classList.toggle('oculto');
        menuNotificaciones.classList.add('oculto'); // Cerrar el otro menú si está abierto
    });
    
    // Cerrar los menús al hacer clic en cualquier otra parte
    document.addEventListener('click', function() {
        menuNotificaciones.classList.add('oculto');
        menuAjustes.classList.add('oculto');
    });
    
    // Evitar que los clics dentro de los menús cierren los mismos
    menuNotificaciones.addEventListener('click', function(evento) {
        evento.stopPropagation();
    });
    
    menuAjustes.addEventListener('click', function(evento) {
        evento.stopPropagation();
    });
    
    // Manejar el clic en "Cerrar sesión"
    enlaceCerrarSesion.addEventListener('click', function(evento) {
        evento.preventDefault();
        
        // Cerrar la sesión actual
        baseDatos.cerrarSesion();
        
        // Redirigir al inicio de sesión
        window.location.href = '../login/login.html';
    });
    
    // Manejar el clic en "Mis datos"
    enlaceDatosUsuario.addEventListener('click', function(evento) {
        evento.preventDefault();
        
        // Aquí se implementará la funcionalidad para ver/editar datos del usuario
        alert('Funcionalidad de "Mis datos" no implementada aún');
    });
    
    // Manejar la navegación en el footer
    botonesNav.forEach(boton => {
        boton.addEventListener('click', function() {
            // Quitar la clase activo de todos los botones
            botonesNav.forEach(btn => btn.classList.remove('activo'));
            
            // Agregar la clase activo al botón clickeado
            this.classList.add('activo');
            
            // Obtener el tipo de botón según su ícono
            const tipoBoton = this.querySelector('.icono-nav').alt.toLowerCase();
            
            // Implementar la navegación según el tipo de botón
            switch (tipoBoton) {
                case 'inicio':
                    // Ya estamos en el inicio (dashboard)
                    console.log('Navegación: Inicio');
                    break;
                case 'chat':
                    console.log('Navegación: Chat');
                    // Navegar a la pantalla de chat
                    window.location.href = '../chat/chat.html';
                    break;
                case 'medicamentos':
                    console.log('Navegación: Medicamentos');
                    // Aquí se implementará la navegación a medicamentos
                    alert('Pantalla de Medicamentos no implementada aún');
                    break;
            }
        });
    });
    
    // Manejar el botón de chat
    botonChat.addEventListener('click', function() {
        console.log('Botón Chat clickeado');
        // Navegar a la pantalla de chat
        window.location.href = '../chat/chat.html';
    });
    
    // Cargar las notificaciones (aquí se podría implementar una llamada a la API)
    // Por ahora usamos las notificaciones estáticas del HTML
    
    console.log('Dashboard inicializado correctamente');
});