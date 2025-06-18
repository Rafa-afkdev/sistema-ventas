/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Edit, Loader2, Lock, Mail, Phone, Trash2, User, UserCheck, Users } from 'lucide-react';
import { showToast } from "nextjs-toast-notify";
import { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  telefono: string;
  estado: number;
  fechaCreacion?: string;
}

export default function GestionarUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  // Estado para el formulario de edición
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    password: '',
    telefono: '',
    estado: '1'
  });

  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Función para obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/usuarios');
      
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        showToast.error("Error al cargar los usuarios", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast.error("Error de conexión al cargar usuarios", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validaciones para el formulario de edición
  const validateEditForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    // Validar nombre
    if (!editFormData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (editFormData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (editFormData.nombre.length > 30) {
      newErrors.nombre = 'El nombre no puede exceder 30 caracteres';
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(editFormData.nombre)) {
      newErrors.nombre = 'El nombre solo debe contener letras y espacios';
    }
    
    // Validar apellido
    if (!editFormData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (editFormData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    } else if (editFormData.apellido.length > 30) {
      newErrors.apellido = 'El apellido no puede exceder 30 caracteres';
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(editFormData.apellido)) {
      newErrors.apellido = 'El apellido solo debe contener letras y espacios';
    }
    
    // Validar usuario
    if (!editFormData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es obligatorio';
    } else if (editFormData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    } else if (editFormData.usuario.length > 15) {
      newErrors.usuario = 'El usuario no puede exceder 15 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(editFormData.usuario)) {
      newErrors.usuario = 'El usuario solo puede contener letras, números y guión bajo';
    }
    
    // Validar contraseña (solo si se proporciona)
    if (editFormData.password) {
      if (editFormData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (editFormData.password.length > 15) {
        newErrors.password = 'La contraseña no puede exceder 15 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(editFormData.password)) {
        newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
      }
    }
    
    // Validar teléfono
    if (!editFormData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{8,15}$/.test(editFormData.telefono.replace(/\s|-/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener entre 8 y 15 dígitos';
    }
    
    return newErrors;
  };

  // Manejar cambios en los inputs de edición
  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (editErrors[field]) {
      setEditErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Verificar si el usuario ya existe (excluyendo el usuario actual)
  const checkUserExistsForEdit = async (usuario: string, currentUserId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/usuarios/check-user?usuario=${encodeURIComponent(usuario)}&excludeId=${currentUserId}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

  // Abrir diálogo de edición
  const openEditDialog = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setEditFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      usuario: usuario.usuario,
      password: '', // Vacío por seguridad
      telefono: usuario.telefono,
      estado: usuario.estado.toString()
    });
    setEditErrors({});
    setIsEditDialogOpen(true);
  };

  // Actualizar usuario
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    // Validar formulario
    const formErrors = validateEditForm();
    if (Object.keys(formErrors).length > 0) {
      setEditErrors(formErrors);
      showToast.error("Por favor, corrige los errores en el formulario", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Verificar si el usuario ya existe (excluyendo el usuario actual)
      if (editFormData.usuario !== selectedUser.usuario) {
        const userExists = await checkUserExistsForEdit(editFormData.usuario, selectedUser.id);
        if (userExists) {
          setEditErrors({ usuario: 'Este nombre de usuario ya está registrado' });
          showToast.error("El nombre de usuario ya existe", {
            duration: 4000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
          setIsUpdating(false);
          return;
        }
      }

      // Preparar datos para enviar
      const userData: any = {
        nombre: editFormData.nombre.trim(),
        apellido: editFormData.apellido.trim(),
        usuario: editFormData.usuario.trim(),
        telefono: editFormData.telefono.trim(),
        estado: parseInt(editFormData.estado)
      };

      // Solo incluir password si se proporcionó
      if (editFormData.password) {
        userData.password = editFormData.password;
      }

      // Enviar datos al servidor
      const response = await fetch(`/api/usuarios/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        showToast.success("¡Usuario actualizado exitosamente!", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });

        // Actualizar la lista de usuarios
        await fetchUsuarios();
        
        // Cerrar diálogo
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        
      } else {
        const errorData = await response.json();
        
        if (errorData.field) {
          setEditErrors({ [errorData.field]: errorData.message });
        }
        
        showToast.error(errorData.message || "Error al actualizar el usuario", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      }
      
    } catch (error) {
      console.error('Error:', error);
      showToast.error("Error de conexión. Intenta nuevamente.", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Abrir diálogo de confirmación de eliminación
  const openDeleteDialog = (usuario: Usuario) => {
    setUserToDelete(usuario);
    setIsDeleteDialogOpen(true);
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(userToDelete.id);

    try {
      const response = await fetch(`/api/usuarios/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast.success("Usuario eliminado exitosamente", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });

        // Actualizar la lista de usuarios
        await fetchUsuarios();
        
      } else {
        const errorData = await response.json();
        showToast.error(errorData.message || "Error al eliminar el usuario", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      }
      
    } catch (error) {
      console.error('Error:', error);
      showToast.error("Error de conexión. Intenta nuevamente.", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
    } finally {
      setIsDeleting(null);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x2">
        <Users className="h-6 w-6 text-primary" />
        <CardTitle className="text-2xl font-bold">Gestionar Usuarios</CardTitle>
        </div>
        <CardDescription>
        Administra los usuarios del sistema. Puedes editar información o eliminar usuarios existentes.
        </CardDescription>
      </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando usuarios...</span>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="flex justify-center w-full">
          <div className="rounded-md border w-full max-w-[1400px]">
          <Table>
                <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  {/* <TableHead>Nombre</TableHead> */}
                  {/* <TableHead>Apellido</TableHead> */}
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                  <TableCell>{usuario.usuario}</TableCell>
                  {/* <TableCell>{usuario.nombre}</TableCell> */}
                  {/* <TableCell>{usuario.apellido}</TableCell> */}
                  <TableCell>{usuario.telefono}</TableCell>
                  <TableCell>
                  <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    usuario.estado === 1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}
                  >
                  {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                  </TableCell>
                  <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(usuario)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(usuario)}
                    disabled={isDeleting === usuario.id}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting === usuario.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                    <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  </div>
                  </TableCell>
                  </TableRow>
                ))}
                </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Editar Usuario</span>
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario. Los campos marcados con (*) son obligatorios.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Nombre *</span>
                </Label>
                <Input
                  id="edit-nombre"
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={editFormData.nombre}
                  onChange={(e) => handleEditInputChange('nombre', e.target.value)}
                  className={editErrors.nombre ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={30}
                />
                {editErrors.nombre && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{editErrors.nombre}</span>
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-apellido" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Apellido *</span>
                </Label>
                <Input
                  id="edit-apellido"
                  type="text"
                  placeholder="Ingrese el apellido"
                  value={editFormData.apellido}
                  onChange={(e) => handleEditInputChange('apellido', e.target.value)}
                  className={editErrors.apellido ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={30}
                />
                {editErrors.apellido && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{editErrors.apellido}</span>
                  </p>
                )}
              </div>
            </div>
            
            {/* Usuario */}
            <div className="space-y-2">
              <Label htmlFor="edit-usuario" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Nombre de Usuario *</span>
              </Label>
              <Input
                id="edit-usuario"
                type="text"
                placeholder="Ingrese el nombre de usuario"
                value={editFormData.usuario}
                onChange={(e) => handleEditInputChange('usuario', e.target.value.toLowerCase())}
                className={editErrors.usuario ? 'border-red-500 focus:border-red-500' : ''}
                maxLength={15}
              />
              {editErrors.usuario && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{editErrors.usuario}</span>
                </p>
              )}
            </div>
            
            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="edit-password" className="flex items-center space-x-1">
                <Lock className="h-4 w-4" />
                <span>Nueva Contraseña</span>
              </Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Dejar vacío para mantener la actual"
                  value={editFormData.password}
                  onChange={(e) => handleEditInputChange('password', e.target.value)}
                  className={editErrors.password ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={15}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {editErrors.password && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{editErrors.password}</span>
                </p>
              )}
              <p className="text-xs text-gray-500">Deja vacío para mantener la contraseña actual</p>
            </div>
            
            {/* Teléfono y Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-telefono" className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>Teléfono *</span>
                </Label>
                <Input
                  id="edit-telefono"
                  type="tel"
                  placeholder="Ingrese el teléfono"
                  value={editFormData.telefono}
                  onChange={(e) => handleEditInputChange('telefono', e.target.value.replace(/[^0-9]/g, ''))}
                  className={editErrors.telefono ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={15}
                />
                {editErrors.telefono && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{editErrors.telefono}</span>
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select value={editFormData.estado} onValueChange={(value) => handleEditInputChange('estado', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Activo</SelectItem>
                    <SelectItem value="0">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUpdateUser}
              disabled={isUpdating}
              className="min-w-[120px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <span>Confirmar Eliminación</span>
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
            </DialogDescription>
          </DialogHeader>
          
          {userToDelete && (
            <div className="py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.nombre} {userToDelete.apellido}</strong> ({userToDelete.usuario})?
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting !== null}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting !== null}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Usuario'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}