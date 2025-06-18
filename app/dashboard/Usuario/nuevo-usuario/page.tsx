/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2, Lock, Mail, Phone, User, UserCheck } from 'lucide-react';
import { showToast } from "nextjs-toast-notify";
import React, { useState } from 'react';

export default function NuevoUsuario() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    password: '',
    telefono: '',
    estado: '1'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validaciones
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.length > 30) {
      newErrors.nombre = 'El nombre no puede exceder 30 caracteres';
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre solo debe contener letras y espacios';
    }
    
    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    } else if (formData.apellido.length > 30) {
      newErrors.apellido = 'El apellido no puede exceder 30 caracteres';
    } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.apellido)) {
      newErrors.apellido = 'El apellido solo debe contener letras y espacios';
    }
    
    // Validar usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es obligatorio';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    } else if (formData.usuario.length > 15) {
      newErrors.usuario = 'El usuario no puede exceder 15 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario)) {
      newErrors.usuario = 'El usuario solo puede contener letras, números y guión bajo';
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (formData.password.length > 15) {
      newErrors.password = 'La contraseña no puede exceder 15 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }
    
    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{8,15}$/.test(formData.telefono.replace(/\s|-/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener entre 8 y 15 dígitos';
    }
    
    return newErrors;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Verificar si el usuario ya existe
  const checkUserExists = async (usuario: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/usuarios/check-user?usuario=${encodeURIComponent(usuario)}`, {
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

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
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
    
    setIsLoading(true);
    
    try {
      // Verificar si el usuario ya existe
      const userExists = await checkUserExists(formData.usuario);
      if (userExists) {
        setErrors({ usuario: 'Este nombre de usuario ya está registrado' });
        showToast.error("El nombre de usuario ya existe", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
        setIsLoading(false);
        return;
      }
      
      // Preparar datos para enviar
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        usuario: formData.usuario.trim(),
        password: formData.password,
        telefono: formData.telefono.trim(),
        estado: parseInt(formData.estado)
      };
      
      // Enviar datos al servidor
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        showToast.success("¡Usuario creado exitosamente!", {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          usuario: '',
          password: '',
          telefono: '',
          estado: '1'
        });
        setErrors({});
        
        // Opcional: redirigir a lista de usuarios
        // router.push('/dashboard/usuarios');
        
      } else {
        const errorData = await response.json();
        
        if (errorData.field) {
          setErrors({ [errorData.field]: errorData.message });
        }
        
        showToast.error(errorData.message || "Error al crear el usuario", {
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Nuevo Usuario</CardTitle>
          </div>
          <CardDescription>
            Complete los datos para registrar un nuevo usuario en el sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Nombre *</span>
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={errors.nombre ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={30}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.nombre}</span>
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellido" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Apellido *</span>
                </Label>
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Ingrese el apellido"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className={errors.apellido ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={30}
                />
                {errors.apellido && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.apellido}</span>
                  </p>
                )}
              </div>
            </div>
            
            {/* Usuario */}
            <div className="space-y-2">
              <Label htmlFor="usuario" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Nombre de Usuario *</span>
              </Label>
              <Input
                id="usuario"
                type="text"
                placeholder="Ingrese el nombre de usuario"
                value={formData.usuario}
                onChange={(e) => handleInputChange('usuario', e.target.value.toLowerCase())}
                className={errors.usuario ? 'border-red-500 focus:border-red-500' : ''}
                maxLength={15}
              />
              {errors.usuario && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.usuario}</span>
                </p>
              )}
            </div>
            
            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-1">
                <Lock className="h-4 w-4" />
                <span>Contraseña *</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese la contraseña"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
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
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </p>
              )}
              <p className="text-xs text-gray-500">Mínimo 6 caracteres con mayúscula, minúscula y número</p>
            </div>
            
            {/* Teléfono y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono" className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>Teléfono *</span>
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="Ingrese el teléfono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value.replace(/[^0-9]/g, ''))}
                  className={errors.telefono ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={15}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.telefono}</span>
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
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
            
            {/* Información adicional */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Los campos marcados con (*) son obligatorios. Asegúrese de que todos los datos sean correctos antes de guardar.
              </AlertDescription>
            </Alert>
            
            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    nombre: '',
                    apellido: '',
                    usuario: '',
                    password: '',
                    telefono: '',
                    estado: '1'
                  });
                  setErrors({});
                }}
                disabled={isLoading}
              >
                Limpiar
              </Button>
              
              <Button type="submit" disabled={isLoading} className="min-w-[120px]" onClick={handleSubmit}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Usuario'
                )}
              </Button>
            </div>
                      </div>
        </CardContent>
      </Card>
    </div>
  );
}