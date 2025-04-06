/**
 * Script para manejar la funcionalidad del Chat con integración de la API de Gemini
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const nombreUsuarioElement = document.getElementById('nombreUsuario');
    const botonNotificaciones = document.getElementById('botonNotificaciones');
    const botonAjustes = document.getElementById('botonAjustes');
    const menuNotificaciones = document.getElementById('menuNotificaciones');
    const menuAjustes = document.getElementById('menuAjustes');
    const enlaceCerrarSesion = document.getElementById('enlaceCerrarSesion');
    const botonesNav = document.querySelectorAll('.boton-nav');
    const contenedorMensajes = document.getElementById('contenedorMensajes');
    const inputMensaje = document.getElementById('inputMensaje');
    const botonEnviar = document.getElementById('botonEnviar');
    
    // Clave API de Gemini
    let geminiApiKey = 'AIzaSyDJWs_U8NWSJIrTZfSIDLX4DXolswEMah8';
    
    // Variables para gestionar el estado del chat
    let esperandoRespuesta = false;
    let historialChat = [];
    
    // Cargar historial de chat desde localStorage
    function cargarHistorialChat() {
        const historialAlmacenado = localStorage.getItem('historialChatSalvita');
        if (historialAlmacenado) {
            try {
                historialChat = JSON.parse(historialAlmacenado);
                // Mostrar el historial en la interfaz
                historialChat.forEach(item => {
                    if (item.tipo === 'usuario') {
                        agregarMensajeUsuario(item.mensaje, false); // No guardar de nuevo
                    } else if (item.tipo === 'bot') {
                        agregarMensajeBot(item.mensaje, false); // No guardar de nuevo
                    }
                });
            } catch (error) {
                console.error('Error al cargar el historial del chat:', error);
                // Si hay error, reiniciamos el historial
                historialChat = [];
            }
        }
    }
    
    // Guardar un mensaje en el historial
    function guardarMensajeEnHistorial(tipo, mensaje) {
        historialChat.push({ tipo, mensaje });
        // Limitar el historial a los últimos 50 mensajes para no sobrecargar localStorage
        if (historialChat.length > 50) {
            historialChat = historialChat.slice(historialChat.length - 50);
        }
        localStorage.setItem('historialChatSalvita', JSON.stringify(historialChat));
    }
    
    // Verificar si hay una sesión activa
    const usuarioActual = baseDatos.verificarSesion();
    
    if (usuarioActual && usuarioActual.nombre) {
        // Actualizar la interfaz con los datos del usuario
        console.log(`Chat inicializado para: ${usuarioActual.nombre}`);
        
        // Actualizar el nombre del usuario en el header
        if (nombreUsuarioElement) {
            nombreUsuarioElement.textContent = `Hola, ${usuarioActual.nombre.split(" ")[0]}!`;
        }
        
        // Cargar historial o personalizar mensaje de bienvenida
        if (localStorage.getItem('historialChatSalvita')) {
            // Si hay historial, lo cargamos
            cargarHistorialChat();
        } else {
            // Si no hay historial, mostramos el mensaje de bienvenida
            personalizarMensajeBienvenida(usuarioActual.nombre);
        }
    } else {
        // Si no hay sesión activa, redirigir al inicio de sesión
        console.error('No se encontró una sesión activa');
        window.location.href = '../login/login.html';
        return;
    }
    
    // Función para personalizar el mensaje de bienvenida
    function personalizarMensajeBienvenida(nombreUsuario) {
        // Limpiar cualquier mensaje existente para asegurar que solo tenemos el nuevo mensaje de bienvenida
        contenedorMensajes.innerHTML = '';
        
        // Añadir el mensaje de bienvenida personalizado con el emoji
        agregarMensajeBot("¡Hola! Soy Salvita 😊. Estoy aquí para ayudarte con cualquier duda sobre tu salud o medicamentos. ¿En qué puedo asistirte hoy?");
        
        // Guardar el mensaje en localStorage para mantenerlo al cambiar de pantalla
        localStorage.setItem('ultimoMensajeSalvita', "¡Hola! Soy Salvita 😊. Estoy aquí para ayudarte con cualquier duda sobre tu salud o medicamentos. ¿En qué puedo asistirte hoy?");
        
        // Hacer scroll al final de los mensajes
        scrollToBottom();
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
    
    // Manejar la navegación en el footer
    botonesNav.forEach(boton => {
        boton.addEventListener('click', function() {
            // Obtener el tipo de botón según su ícono
            const tipoBoton = this.querySelector('.icono-nav').alt.toLowerCase();
            
            // Implementar la navegación según el tipo de botón
            switch (tipoBoton) {
                case 'inicio':
                    // Navegar al dashboard
                    window.location.href = '../dashboard/dashboard.html';
                    break;
                case 'chat':
                    // Ya estamos en chat, no hacer nada
                    break;
                case 'medicamentos':
                    // Pantalla de medicamentos (no implementada aún)
                    alert('Pantalla de Medicamentos no implementada aún');
                    break;
            }
        });
    });
    
    // Función para añadir mensaje del usuario al chat
    function agregarMensajeUsuario(mensaje, guardar = true) {
        const mensajeElement = document.createElement('div');
        mensajeElement.className = 'mensaje mensaje-usuario';
        mensajeElement.innerHTML = `
            <div class="contenido-mensaje">
                <p>${formatearMensaje(mensaje)}</p>
            </div>
        `;
        contenedorMensajes.appendChild(mensajeElement);
        scrollToBottom();
        
        // Si guardar es true, guardamos en el historial
        if (guardar) {
            guardarMensajeEnHistorial('usuario', mensaje);
        }
    }
    
    // Función para añadir mensaje del bot al chat
    function agregarMensajeBot(mensaje, guardar = true) {
        const mensajeElement = document.createElement('div');
        mensajeElement.className = 'mensaje mensaje-bot';
        mensajeElement.innerHTML = `
            <div class="avatar-bot">
                <img src="../dashboard/iconos/logo.svg" alt="Salvita" class="logo-chat">
            </div>
            <div class="contenido-mensaje">
                <p>${formatearMensaje(mensaje)}</p>
            </div>
        `;
        contenedorMensajes.appendChild(mensajeElement);
        scrollToBottom();
        
        // Si guardar es true, guardamos en el historial
        if (guardar) {
            guardarMensajeEnHistorial('bot', mensaje);
        }
    }
    
    // Función para mostrar indicador de "escribiendo..."
    function mostrarIndicadorEscribiendo() {
        const indicadorElement = document.createElement('div');
        indicadorElement.className = 'mensaje mensaje-bot';
        indicadorElement.id = 'indicadorEscribiendo';
        indicadorElement.innerHTML = `
            <div class="avatar-bot">
                <img src="../dashboard/iconos/logo.svg" alt="Salvita" class="logo-chat">
            </div>
            <div class="contenido-mensaje">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        contenedorMensajes.appendChild(indicadorElement);
        scrollToBottom();
    }
    
    // Función para ocultar indicador de "escribiendo..."
    function ocultarIndicadorEscribiendo() {
        const indicador = document.getElementById('indicadorEscribiendo');
        if (indicador) {
            indicador.remove();
        }
    }
    
    // Función para formatear mensajes (convertir URLs, Markdown, saltos de línea, etc.)
    function formatearMensaje(texto) {
        // Primero convertir caracteres especiales para evitar inyección HTML
        let formateado = texto
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Convertir URLs en enlaces clickeables
        formateado = formateado.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Formatear Markdown:
        
        // Encabezados
        formateado = formateado.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        formateado = formateado.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        formateado = formateado.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        
        // Negritas
        formateado = formateado.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        formateado = formateado.replace(/\*(.+?)\*/g, '<strong>$1</strong>');
        
        // Cursivas
        formateado = formateado.replace(/\_(.+?)\_/g, '<em>$1</em>');
        
        // Listas
        formateado = formateado.replace(/^\- (.+)$/gm, '<li>$1</li>');
        
        // Convertir secuencias de elementos de lista en listas completas
        formateado = formateado.replace(/(<li>.+<\/li>\n)+/g, function(match) {
            return '<ul>' + match + '</ul>';
        });
        
        // Convertir saltos de línea en <br> (después de procesar Markdown para no interferir)
        formateado = formateado.replace(/\n/g, '<br>');
        
        return formateado;
    }
    
    // Función para hacer scroll al último mensaje
    function scrollToBottom() {
        contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }
    
    // Función para enviar petición a la API de Gemini
    async function enviarConsultaAGemini(mensaje) {
        
        try {
            // Preparar contexto médico para el asistente
            const contextoPaciente = usuarioActual.nombre ? 
                `Eres un asistente médico llamado Salvita que está ayudando a ${usuarioActual.nombre}.` : 
                'Eres un asistente médico llamado Salvita.';
            
            const instrucciones = `${contextoPaciente} 
                Proporciona información médica precisa y fácil de entender.
                Ofrece consejos generales de salud y bienestar.
                Recuerda que no reemplazas a un médico real.
                Siempre recomienda buscar atención médica profesional para diagnósticos o tratamientos.
                Responde en español utilizando un tono amigable y respetuoso.
                Si no sabes algo, admítelo claramente.
                Evita dar diagnósticos médicos específicos.
                Utiliza lenguaje sencillo para adultos mayores.
                
                IMPORTANTE:
                - No saludes a menos que sea la primera interacción.
                - Si necesitas hacer respuestas extensas, limítalas a un máximo de 100 palabras.
                - Utiliza Markdown para mejorar el formato de tus respuestas:
                  * Usa *texto* para negritas.
                  * Usa _texto_ para cursivas.
                  * Usa # Título para encabezados.
                  * Usa - elemento para listas.`;
            
            const consulta = `${instrucciones}\n\nConsulta del paciente: ${mensaje}`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: consulta }]
                    }]
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Extraer el texto de la respuesta, manejando posibles cambios en la estructura de la API
            let respuesta = '';
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const content = data.candidates[0].content;
                if (content.parts && content.parts[0] && content.parts[0].text) {
                    respuesta = content.parts[0].text;
                }
            }
            
            if (!respuesta) {
                throw new Error('Formato de respuesta inesperado');
            }
            
            return respuesta;
            
        } catch (error) {
            console.error('Error al consultar a Gemini:', error);
            return `Lo siento, ocurrió un error al procesar tu consulta. ${error.message}`;
        }
    }
    
    // Función principal para enviar mensaje al chatbot
    async function enviarMensaje() {
        const mensaje = inputMensaje.value.trim();
        
        if (mensaje === '' || esperandoRespuesta) {
            return;
        }
        
        // Limpiar el input
        inputMensaje.value = '';
        
        // Mostrar mensaje del usuario
        agregarMensajeUsuario(mensaje);
        
        // Indicar que estamos esperando respuesta
        esperandoRespuesta = true;
        
        // Mostrar indicador de "escribiendo..."
        mostrarIndicadorEscribiendo();
        
        try {
            // Enviar mensaje a Gemini y obtener respuesta
            const respuesta = await enviarConsultaAGemini(mensaje);
            
            // Ocultar indicador
            ocultarIndicadorEscribiendo();
            
            // Mostrar respuesta
            agregarMensajeBot(respuesta);
            
        } catch (error) {
            // Ocultar indicador
            ocultarIndicadorEscribiendo();
            
            // Mostrar mensaje de error
            agregarMensajeBot('Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta de nuevo más tarde.');
            console.error('Error en el chat:', error);
        }
        
        // Ya no estamos esperando respuesta
        esperandoRespuesta = false;
    }
    
    // Event listener para el botón de enviar
    botonEnviar.addEventListener('click', enviarMensaje);
    
    // Event listener para enviar con Enter
    inputMensaje.addEventListener('keydown', function(evento) {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            enviarMensaje();
        }
    });
    
    // La API key ya está configurada, no es necesario solicitarla
    
    // Hacer focus en el input al cargar la página
    inputMensaje.focus();
    
    // Hacer scroll al final de los mensajes al cargar la página
    scrollToBottom();
});