import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CommonModule,
    TableModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MessagesModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  providers: [MessageService],
})
export class AuthComponent {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  messagesLogin: any[] = [];
  messagesRegister: any[] = [];

  // Función para validar el formato del correo
  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.messagesLogin = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, completa todos los campos',
        },
      ];
      return;
    }

    // Validación del formato del correo antes de hacer la solicitud al backend
    if (!this.isEmailValid(this.email)) {
      this.messagesLogin = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Formato inválido del correo',
        },
      ];
      return;
    }

    try {
      const response: any = await this.authService
        .login(this.email, this.password)
        .toPromise();

      // Guardamos el token en el localStorage
      localStorage.setItem('authToken', response.token);

      // Si el backend devuelve un mensaje de éxito
      this.messagesLogin = [
        {
          severity: 'success',
          summary: 'Inicio de sesión',
          detail: '¡Bienvenido!',
        },
      ];
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en login:', error);

      // Verificamos si el error es de validación de formato de correo
      if (error?.error?.[0]?.msg === 'El email no es válido') {
        this.messagesLogin = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'El formato del correo electrónico es incorrecto',
          },
        ];
      } else if (error?.error?.message === 'Credenciales inválidas') {
        this.messagesLogin = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'Correo o contraseña incorrectos',
          },
        ];
      } else {
        // Si no es el error de credenciales, mostramos un error genérico
        this.messagesLogin = [
          {
            severity: 'error',
            summary: 'Error en el servidor',
            detail: 'Hubo un problema al iniciar sesión. Intenta nuevamente',
          },
        ];
      }
    }
  }

  // Función para manejar el registro
  async onRegisterSubmit(): Promise<void> {
    // Verificar si los campos son válidos
    if (
      !this.nombre ||
      !this.apellidos ||
      !this.email ||
      !this.password ||
      !this.passwordConfirm
    ) {
      this.messagesRegister = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor, completa todos los campos',
        },
      ];
      return;
    }

    // Verificar que las contraseñas coincidan
    if (this.password !== this.passwordConfirm) {
      this.messagesRegister = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'Las contraseñas no coinciden',
        },
      ];
      return;
    }

    try {
      // Crear el objeto con los datos del registro
      const user = {
        nombre: this.nombre,
        apellidos: this.apellidos,
        email: this.email,
        password: this.password,
      };

      // Llamar al servicio de registro
      const response: any = await this.authService.register(user).toPromise();

      // Si la respuesta es exitosa
      this.messagesRegister = [
        {
          severity: 'success',
          summary: 'Registro exitoso',
          detail: '¡Te has registrado correctamente!',
        },
      ];

      // Opcional: redirigir al usuario después del registro
      // this.router.navigate(['/login']); // Si tienes una ruta de login
    } catch (error: any) {
      console.error('Error en registro:', error);

      // Manejar el error
      const errorMessage = error?.error?.message || 'Error en el servidor';
      this.messagesRegister = [
        {
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        },
      ];
    }
  }

  //TODO: Añadir a componente navegador
  logout(): void {
    // Eliminar el token del localStorage
    localStorage.removeItem('authToken');

    // Redirigir al usuario al inicio de sesión
    this.router.navigate(['/']);
  }
}
