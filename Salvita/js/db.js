/**
 * Sistema de gestión de almacenamiento para la aplicación Salvita
 * Maneja el almacenamiento y recuperación de usuarios y datos de sesión
 * Ahora guarda cada usuario en un archivo JSON individual en la carpeta 'users'
 */

const baseDatos = {
    // Obtiene la lista de usuarios registrados
    obtenerListaUsuarios: async function() {
        try {
            const response = await fetch('/users/lista.json');
            if (response.ok) {
                return await response.json();
            } else {
                // Si no existe el archivo de lista, inicializarlo
                return { ultimoId: 0, usuarios: [] };
            }
        } catch (error) {
            console.error('Error al obtener lista de usuarios:', error);
            return { ultimoId: 0, usuarios: [] };
        }
    },
    
    // Guarda la lista de usuarios
    guardarListaUsuarios: async function(listaUsuarios) {
        try {
            const response = await fetch('/users/lista.json', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(listaUsuarios)
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error al guardar lista de usuarios:', error);
            return false;
        }
    },
    
    // Obtiene un usuario específico por ID
    obtenerUsuario: async function(id) {
        try {
            const response = await fetch(`/users/user${id.toString().padStart(4, '0')}.json`);
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error(`Error al obtener usuario ${id}:`, error);
            return null;
        }
    },
    
    // Busca usuarios por credenciales (correo o teléfono)
    buscarUsuarioPorCredencial: async function(credencial) {
        const listaUsuarios = await this.obtenerListaUsuarios();
        
        // Buscar en la lista por correo o teléfono
        const usuarioInfo = listaUsuarios.usuarios.find(u => 
            u.correo === credencial || u.telefono === credencial
        );
        
        if (usuarioInfo) {
            return await this.obtenerUsuario(usuarioInfo.id);
        }
        
        return null;
    },
    
    // Verifica si existe un usuario con el mismo correo o teléfono
    verificarUsuarioExistente: async function(correo, telefono) {
        const listaUsuarios = await this.obtenerListaUsuarios();
        
        // Verificar correo
        const existeCorreo = listaUsuarios.usuarios.some(u => u.correo === correo);
        if (existeCorreo) {
            return { existe: true, mensaje: 'El correo electrónico ya está registrado' };
        }
        
        // Verificar teléfono
        if (telefono) {
            const existeTelefono = listaUsuarios.usuarios.some(u => u.telefono === telefono);
            if (existeTelefono) {
                return { existe: true, mensaje: 'El número telefónico ya está registrado' };
            }
        }
        
        return { existe: false };
    },
    
    // Registra un nuevo usuario
    registrarUsuario: async function(usuario) {
        try {
            // Verificar si ya existe un usuario con el mismo correo o teléfono
            const verificacion = await this.verificarUsuarioExistente(usuario.correo, usuario.telefono);
            if (verificacion.existe) {
                return { exito: false, mensaje: verificacion.mensaje };
            }
            
            // Obtener la lista de usuarios para asignar un nuevo ID
            const listaUsuarios = await this.obtenerListaUsuarios();
            
            // Asignar ID secuencial
            const nuevoId = listaUsuarios.ultimoId + 1;
            usuario.id = nuevoId;
            
            // Generar nombre de archivo con padding
            const nombreArchivo = `user${nuevoId.toString().padStart(4, '0')}.json`;
            
            // Guardar el usuario en su propio archivo JSON
            const responseUsuario = await fetch(`/users/${nombreArchivo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
            
            if (!responseUsuario.ok) {
                return { exito: false, mensaje: 'Error al guardar los datos del usuario' };
            }
            
            // Actualizar la lista de usuarios
            listaUsuarios.ultimoId = nuevoId;
            listaUsuarios.usuarios.push({
                id: nuevoId,
                nombre: usuario.nombre,
                correo: usuario.correo,
                telefono: usuario.telefono
            });
            
            // Guardar la lista actualizada
            const resultadoLista = await this.guardarListaUsuarios(listaUsuarios);
            
            if (!resultadoLista) {
                return { exito: false, mensaje: 'Error al actualizar la lista de usuarios' };
            }
            
            return { 
                exito: true, 
                mensaje: 'Usuario registrado correctamente',
                id: nuevoId 
            };
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return { exito: false, mensaje: 'Error interno al registrar usuario' };
        }
    },
    
    // Autenticar usuario con correo/teléfono y contraseña
    autenticarUsuario: async function(credencial, contrasena, mantenerSesion) {
        try {
            // Buscar usuario por credencial (correo o teléfono)
            const usuario = await this.buscarUsuarioPorCredencial(credencial);
            
            if (usuario && usuario.contrasena === contrasena) {
                // Siempre guardar los datos de la sesión actual
                // La opción mantenerSesion determina si se guarda permanentemente o no
                // (esto se implementará más adelante)
                localStorage.setItem('usuarioActual', JSON.stringify({
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo
                }));
                
                return { exito: true, usuario: usuario };
            } else {
                return { exito: false, mensaje: 'Credenciales inválidas' };
            }
        } catch (error) {
            console.error('Error al autenticar usuario:', error);
            return { exito: false, mensaje: 'Error interno al autenticar usuario' };
        }
    },
    
    // Verificar si hay una sesión activa
    verificarSesion: function() {
        const usuarioActual = localStorage.getItem('usuarioActual');
        return usuarioActual ? JSON.parse(usuarioActual) : null;
    },
    
    // Cerrar sesión
    cerrarSesion: function() {
        localStorage.removeItem('usuarioActual');
    }
};
