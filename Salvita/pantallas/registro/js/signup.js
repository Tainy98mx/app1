/**
 * Script para manejar la funcionalidad de la pantalla de registro
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos principales
    const formularioRegistro = document.getElementById('formularioRegistro');
    const seccionDatosPersonales = document.getElementById('seccionDatosPersonales');
    const seccionDatosMedicos = document.getElementById('seccionDatosMedicos');
    const seccionDatosCuidador = document.getElementById('seccionDatosCuidador');
    const mensajeAlerta = document.getElementById('mensajeAlerta');
    
    // Referencias a botones de navegación
    const btnSiguienteDatosMedicos = document.getElementById('siguienteDatosMedicos');
    const btnSiguienteDatosCuidador = document.getElementById('siguienteDatosCuidador');
    const btnVolverDatosPersonales = document.getElementById('volverDatosPersonales');
    const btnVolverDatosMedicos = document.getElementById('volverDatosMedicos');
    const btnVolverInicio = document.getElementById('volverInicio');
    const btnCompletarRegistro = document.getElementById('completarRegistro');
    
    // Referencias a pasos del progreso
    const pasos = document.querySelectorAll('.paso');
    
    // Referencias a campos específicos
    const campoContrasena = document.getElementById('contrasena');
    const campoConfirmarContrasena = document.getElementById('confirmarContrasena');
    const botonMostrarContrasena = document.getElementById('mostrarContrasena');
    const checkboxTieneCuidador = document.getElementById('tieneCuidador');
    const formularioCuidador = document.getElementById('formularioCuidador');
    const checkboxEnfOtra = document.getElementById('enf-otra');
    const campoEnfOtraTexto = document.getElementById('enf-otra-texto');
    
    // Referencias a campos con mensajes de error
    const errorNombre = document.getElementById('errorNombre');
    const errorFechaNacimiento = document.getElementById('errorFechaNacimiento');
    const errorGenero = document.getElementById('errorGenero');
    const errorCorreo = document.getElementById('errorCorreo');
    const errorContrasena = document.getElementById('errorContrasena');
    const errorConfirmarContrasena = document.getElementById('errorConfirmarContrasena');
    const errorTelefono = document.getElementById('errorTelefono');
    
    // Referencias a requisitos de contraseña
    const reqLongitud = document.getElementById('req-longitud');
    const reqMayuscula = document.getElementById('req-mayuscula');
    const reqNumero = document.getElementById('req-numero');
    
    // Función para mostrar/ocultar contraseña
    botonMostrarContrasena.addEventListener('click', function() {
        if (campoContrasena.type === 'password') {
            campoContrasena.type = 'text';
            campoConfirmarContrasena.type = 'text';
            botonMostrarContrasena.textContent = 'Ocultar';
        } else {
            campoContrasena.type = 'password';
            campoConfirmarContrasena.type = 'password';
            botonMostrarContrasena.textContent = 'Mostrar';
        }
    });
    
    // Función para mostrar/ocultar formulario del cuidador
    checkboxTieneCuidador.addEventListener('change', function() {
        if (this.checked) {
            formularioCuidador.classList.remove('oculto');
        } else {
            formularioCuidador.classList.add('oculto');
        }
    });
    
    // Función para mostrar/ocultar campo adicional en "Otra enfermedad"
    checkboxEnfOtra.addEventListener('change', function() {
        if (this.checked) {
            campoEnfOtraTexto.classList.remove('oculto');
        } else {
            campoEnfOtraTexto.classList.add('oculto');
            campoEnfOtraTexto.value = '';
        }
    });
    
    // Validación de contraseña en tiempo real
    campoContrasena.addEventListener('input', validarRequisitosContrasena);
    
    function validarRequisitosContrasena() {
        const contrasena = campoContrasena.value;
        
        // Validar longitud (8+ caracteres)
        if (contrasena.length >= 8) {
            reqLongitud.classList.add('cumplido');
        } else {
            reqLongitud.classList.remove('cumplido');
        }
        
        // Validar mayúscula
        if (/[A-Z]/.test(contrasena)) {
            reqMayuscula.classList.add('cumplido');
        } else {
            reqMayuscula.classList.remove('cumplido');
        }
        
        // Validar número
        if (/[0-9]/.test(contrasena)) {
            reqNumero.classList.add('cumplido');
        } else {
            reqNumero.classList.remove('cumplido');
        }
    }
    
    // Validar coincidencia de contraseñas
    campoConfirmarContrasena.addEventListener('input', function() {
        if (campoContrasena.value !== campoConfirmarContrasena.value) {
            errorConfirmarContrasena.textContent = 'Las contraseñas no coinciden';
        } else {
            errorConfirmarContrasena.textContent = '';
        }
    });
    
    // Navegación entre secciones
    btnSiguienteDatosMedicos.addEventListener('click', function() {
        if (validarDatosPersonales()) {
            cambiarSeccion(seccionDatosPersonales, seccionDatosMedicos);
            actualizarProgreso(1);
        }
    });
    
    btnSiguienteDatosCuidador.addEventListener('click', function() {
        cambiarSeccion(seccionDatosMedicos, seccionDatosCuidador);
        actualizarProgreso(2);
    });
    
    btnVolverDatosPersonales.addEventListener('click', function() {
        cambiarSeccion(seccionDatosMedicos, seccionDatosPersonales);
        actualizarProgreso(0);
    });
    
    btnVolverDatosMedicos.addEventListener('click', function() {
        cambiarSeccion(seccionDatosCuidador, seccionDatosMedicos);
        actualizarProgreso(1);
    });
    
    btnVolverInicio.addEventListener('click', function() {
        window.location.href = '../../index.html';
    });
    
    // Función para cambiar entre secciones
    function cambiarSeccion(seccionActual, seccionNueva) {
        seccionActual.classList.add('oculto');
        seccionNueva.classList.remove('oculto');
        
        // Scroll hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Función para actualizar el indicador de progreso
    function actualizarProgreso(pasoActivo) {
        pasos.forEach((paso, indice) => {
            if (indice < pasoActivo) {
                paso.classList.remove('activo');
                paso.classList.add('completado');
            } else if (indice === pasoActivo) {
                paso.classList.add('activo');
                paso.classList.remove('completado');
            } else {
                paso.classList.remove('activo', 'completado');
            }
        });
    }
    
    // Validación de datos personales
    function validarDatosPersonales() {
        let esValido = true;
        
        // Limpiar mensajes de error anteriores
        errorNombre.textContent = '';
        errorFechaNacimiento.textContent = '';
        errorGenero.textContent = '';
        errorCorreo.textContent = '';
        errorContrasena.textContent = '';
        errorConfirmarContrasena.textContent = '';
        errorTelefono.textContent = '';
        
        // Validar nombre completo
        const nombre = document.getElementById('nombre').value.trim();
        if (!nombre) {
            errorNombre.textContent = 'Ingrese su nombre completo';
            esValido = false;
        }
        
        // Validar fecha de nacimiento
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        if (!fechaNacimiento) {
            errorFechaNacimiento.textContent = 'Seleccione su fecha de nacimiento';
            esValido = false;
        } else {
            // Validar que sea mayor de edad
            const hoy = new Date();
            const fechaNac = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            
            if (edad < 18) {
                errorFechaNacimiento.textContent = 'Debe ser mayor de 18 años';
                esValido = false;
            }
        }
        
        // Validar género
        const genero = document.getElementById('genero').value;
        if (!genero) {
            errorGenero.textContent = 'Seleccione su género';
            esValido = false;
        }
        
        // Validar correo electrónico
        const correo = document.getElementById('correo').value.trim();
        if (!correo) {
            errorCorreo.textContent = 'Ingrese su correo electrónico';
            esValido = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            errorCorreo.textContent = 'Ingrese un correo electrónico válido';
            esValido = false;
        }
        
        // Validar contraseña
        const contrasena = campoContrasena.value;
        if (!contrasena) {
            errorContrasena.textContent = 'Ingrese una contraseña';
            esValido = false;
        } else if (contrasena.length < 8) {
            errorContrasena.textContent = 'La contraseña debe tener al menos 8 caracteres';
            esValido = false;
        } else if (!/[A-Z]/.test(contrasena)) {
            errorContrasena.textContent = 'La contraseña debe tener al menos una mayúscula';
            esValido = false;
        } else if (!/[0-9]/.test(contrasena)) {
            errorContrasena.textContent = 'La contraseña debe tener al menos un número';
            esValido = false;
        }
        
        // Validar confirmación de contraseña
        const confirmarContrasena = campoConfirmarContrasena.value;
        if (!confirmarContrasena) {
            errorConfirmarContrasena.textContent = 'Confirme su contraseña';
            esValido = false;
        } else if (contrasena !== confirmarContrasena) {
            errorConfirmarContrasena.textContent = 'Las contraseñas no coinciden';
            esValido = false;
        }
        
        // Validar teléfono
        const telefono = document.getElementById('telefono').value.trim();
        if (!telefono) {
            errorTelefono.textContent = 'Ingrese su número telefónico';
            esValido = false;
        } else if (!/^\d{7,15}$/.test(telefono.replace(/\D/g, ''))) {
            errorTelefono.textContent = 'Ingrese un número telefónico válido';
            esValido = false;
        }
        
        return esValido;
    }
    
    // Procesar el formulario completo
    formularioRegistro.addEventListener('submit', async function(evento) {
        evento.preventDefault();
        
        // Mostrar indicador de carga
        mensajeAlerta.classList.remove('oculto', 'error', 'exito');
        mensajeAlerta.classList.add('cargando');
        mensajeAlerta.textContent = 'Procesando registro...';
        
        // Recopilar todos los datos del formulario
        const datosUsuario = {
            // Datos personales
            nombre: document.getElementById('nombre').value.trim(),
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            genero: document.getElementById('genero').value,
            correo: document.getElementById('correo').value.trim(),
            contrasena: document.getElementById('contrasena').value,
            telefono: document.getElementById('telefono').value.trim(),
            
            // Datos médicos
            enfermedades: obtenerEnfermedadesSeleccionadas(),
            alergias: document.getElementById('alergias').value.trim(),
            grupoSanguineo: document.getElementById('grupoSanguineo').value,
            
            // Datos del cuidador
            tieneCuidador: document.getElementById('tieneCuidador').checked,
            cuidador: obtenerDatosCuidador(),
            
            // Metadatos
            fechaRegistro: new Date().toISOString()
        };
        
        try {
            // Guardar en la base de datos (proceso asíncrono)
            const resultado = await baseDatos.registrarUsuario(datosUsuario);
            
            if (resultado.exito) {
                // Mostrar mensaje de éxito
                mensajeAlerta.classList.remove('oculto', 'error', 'cargando');
                mensajeAlerta.classList.add('exito');
                mensajeAlerta.textContent = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
                
                // Registrar en consola el ID asignado
                console.log(`Usuario registrado con ID: ${resultado.id}`);
                
                // Redirigir a la página de inicio de sesión después de un breve retraso
                setTimeout(function() {
                    window.location.href = '../login/login.html';
                }, 2000);
            } else {
                // Mostrar mensaje de error
                mensajeAlerta.classList.remove('oculto', 'exito', 'cargando');
                mensajeAlerta.classList.add('error');
                mensajeAlerta.textContent = resultado.mensaje;
                
                // Volver a la primera sección si hay error
                cambiarSeccion(seccionDatosCuidador, seccionDatosPersonales);
                actualizarProgreso(0);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            
            // Mostrar mensaje de error
            mensajeAlerta.classList.remove('oculto', 'exito', 'cargando');
            mensajeAlerta.classList.add('error');
            mensajeAlerta.textContent = 'Error interno al procesar el registro. Intente nuevamente.';
            
            // Volver a la primera sección
            cambiarSeccion(seccionDatosCuidador, seccionDatosPersonales);
            actualizarProgreso(0);
        }
    });
    
    // Función para obtener las enfermedades seleccionadas
    function obtenerEnfermedadesSeleccionadas() {
        const checkboxes = document.querySelectorAll('input[name="enfermedades"]:checked');
        const enfermedades = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.value === 'otra' && campoEnfOtraTexto.value.trim()) {
                enfermedades.push(campoEnfOtraTexto.value.trim());
            } else if (checkbox.value !== 'otra') {
                enfermedades.push(checkbox.value);
            }
        });
        
        return enfermedades;
    }
    
    // Función para obtener los datos del cuidador
    function obtenerDatosCuidador() {
        if (!document.getElementById('tieneCuidador').checked) {
            return null;
        }
        
        return {
            nombre: document.getElementById('nombreCuidador').value.trim(),
            relacion: document.getElementById('relacionCuidador').value,
            telefono: document.getElementById('telefonoCuidador').value.trim(),
            correo: document.getElementById('correoCuidador').value.trim(),
            recibeNotificaciones: document.getElementById('notificacionesCuidador').checked
        };
    }
    
    // Efectos visuales para mejorar la experiencia
    const camposEntrada = document.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    
    camposEntrada.forEach(campo => {
        // Efecto al enfocar un campo
        campo.addEventListener('focus', function() {
            if (this.parentElement.classList.contains('campo-con-icono')) {
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.transition = 'all 0.3s ease';
            } else {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            }
        });
        
        // Restaurar al quitar el foco
        campo.addEventListener('blur', function() {
            if (this.parentElement.classList.contains('campo-con-icono')) {
                this.parentElement.style.transform = 'scale(1)';
            } else {
                this.style.transform = 'scale(1)';
            }
        });
    });
});
