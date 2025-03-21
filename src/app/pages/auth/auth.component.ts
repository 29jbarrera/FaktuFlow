import { Component } from '@angular/core';
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
    InputTextModule, // Importa el módulo de InputText
    ButtonModule, // Importa el módulo de Button
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
  email: string = '';
  password: string = '';
  messages: any[] = [
    { severity: 'info', detail: 'Info Message' },
    { severity: 'success', detail: 'Success Message' },
    { severity: 'warn', detail: 'Warning Message' },
    { severity: 'error', detail: 'Error Message' },
    { severity: 'secondary', detail: 'Secondary Message' },
    { severity: 'contrast', detail: 'Contrast Message' },
  ];

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Aquí puedes manejar la respuesta exitosa del backend
        console.log('Login exitoso', response);
        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Inicio de sesión',
          detail: '¡Bienvenido!',
        });
      },
      error: (error) => {
        if (error.status === 400) {
          // Error: Correo no encontrado o incorrecto
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Correo no registrado',
          });
        } else if (error.status === 401) {
          // Error: Contraseña incorrecta
          this.messageService.add({
            severity: 'error',
            summary: 'Contraseña Incorrecta',
            detail: 'La contraseña proporcionada es incorrecta',
          });
        } else {
          // Otro tipo de error
          this.messageService.add({
            severity: 'error',
            summary: 'Error en el inicio de sesión',
            detail: 'Hubo un problema al iniciar sesión. Intenta nuevamente',
          });
        }
      },
    });
  }
}
