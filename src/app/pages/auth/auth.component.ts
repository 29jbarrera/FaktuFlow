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
import {} from '@angular/common/http';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageService, Message } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { User } from '../../interfaces/user';

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
    
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,
    FormsModule,
    MessagesModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  providers: [MessageService],
})
export class AuthComponent {
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  emailRegister: string = '';
  password: string = '';
  passwordRegister: string = '';
  passwordRegisterConfirm: string = '';
  messagesLogin: Message[] = [];
  messagesRegister: Message[] = [];
  isLoading = false;

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

      this.authService.storeUserData(response);

      this.messagesLogin = [
        {
          severity: 'success',
          summary: 'Inicio de sesión',
          detail: '¡Bienvenido!',
        },
      ];
      this.isLoading = true;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } catch (error: any) {
      console.error('Error en login:', error);

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
        this.messagesLogin = [
          {
            severity: 'error',
            summary: 'Error en el servidor',
            detail: 'Hubo un problema al iniciar sesión. Intenta nuevamente',
          },
        ];
      }
      this.isLoading = false;
    }
  }

  async onRegisterSubmit(): Promise<void> {
    if (
      !this.nombre ||
      !this.apellidos ||
      !this.emailRegister ||
      !this.passwordRegister ||
      !this.passwordRegisterConfirm
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

    if (this.passwordRegister !== this.passwordRegisterConfirm) {
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
      const user: User = {
        nombre: this.nombre,
        apellidos: this.apellidos,
        email: this.emailRegister,
        password: this.passwordRegister,
      };

      const response = await this.authService.register(user).toPromise();

      if (!response) {
        this.messagesRegister = [
          {
            severity: 'error',
            summary: 'Error',
            detail: 'No se recibió respuesta del servidor',
          },
        ];
        return;
      }

      this.messagesRegister = [
        {
          severity: 'success',
          summary: 'Registro exitoso',
          detail: '¡Te has registrado correctamente!',
        },
      ];

      this.nombre = '';
      this.apellidos = '';
      this.emailRegister = '';
      this.passwordRegister = '';
      this.passwordRegisterConfirm = '';
    } catch (error: any) {
      console.error('Error en registro:', error);

      if (error?.error?.errors && Array.isArray(error.error.errors)) {
        this.messagesRegister = error.error.errors.map((err: any) => ({
          severity: 'error',
          summary: 'Error',
          detail: err.msg,
        }));
      } else {
        this.messagesRegister = [
          {
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Error en el servidor',
          },
        ];
      }
    }
  }
}
