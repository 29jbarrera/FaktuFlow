import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfoService } from './info.service';
import { UserData } from '../../interfaces/user';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ValidationMessage } from '../../interfaces/validation-message.interface';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    ButtonModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    MessageModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  providers: [MessageService],
})
export class InfoComponent implements OnInit {
  @ViewChild('passwordForm') passwordForm!: NgForm;
  userInitial: string = '';
  usuario: UserData = {
    id: 0,
    nombre: '',
    apellidos: '',
    email: '',
    fecha_registro: new Date(),
    rol: '',
  };

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  openDialog = false;

  validationPassword: ValidationMessage[] = [];

  validationUserData: ValidationMessage[] = [];

  tempUsuario: UserData = { ...this.usuario };

  constructor(private infoService: InfoService) {}

  cerrarSesion() {
    console.log('Cerrar sesión');
  }

  ngOnInit(): void {
    const userId = Number(sessionStorage.getItem('usuario_id'));
    if (userId) {
      this.getUserData(userId);
    }
  }

  getUserData(id: number): void {
    this.infoService.getUserData(id).subscribe((data) => {
      this.usuario = {
        ...data,
      };
      this.getUserInitial();
    });
  }

  getUserInitial(): void {
    this.userInitial = this.usuario.nombre
      ? this.usuario.nombre.charAt(0).toUpperCase()
      : '';
  }

  abrirModalEdicion(usuario: UserData): void {
    this.tempUsuario = { ...usuario };
    this.openDialog = true;
  }

  updateUserData() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !this.tempUsuario.nombre ||
      !this.tempUsuario.apellidos ||
      !this.tempUsuario.email
    ) {
      this.validationUserData = [
        {
          severity: 'error',
          summary: 'Campos incompletos',
          text: 'Por favor completa todos los campos obligatorios (*).',
        },
      ];
      return;
    }

    if (!emailRegex.test(this.usuario.email)) {
      this.validationUserData = [
        {
          severity: 'error',
          summary: 'Email inválido',
          text: 'Por favor ingresa un correo electrónico válido.',
        },
      ];
      return;
    }

    this.infoService
      .updateUserInfo(
        this.tempUsuario.id,
        this.tempUsuario.nombre,
        this.tempUsuario.apellidos,
        this.tempUsuario.email
      )
      .subscribe({
        next: (res) => {
          this.usuario = { ...this.tempUsuario };
          this.validationUserData = [
            {
              severity: 'success',
              summary: 'Éxito',
              text: res?.message || 'Datos actualizados correctamente.',
            },
          ];
          this.openDialog = false;
        },
        error: (err) => {
          const serverError =
            err?.error?.errors?.[0]?.msg ||
            err.error.message ||
            'Error al actualizar los datos.';
          this.validationUserData = [
            {
              severity: 'error',
              summary: 'Error',
              text: serverError,
            },
          ];
        },
      });
  }

  changePassword() {
    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmNewPassword
    ) {
      this.validationPassword = [
        {
          severity: 'error',
          summary: 'Campos incompletos',
          text: 'Por favor completa todos los campos.',
        },
      ];
      return;
    }

    if (this.newPassword.length < 4) {
      this.validationPassword = [
        {
          severity: 'error',
          summary: 'Error',
          text: 'La nueva contraseña debe tener al menos 4 caracteres.',
        },
      ];
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.validationPassword = [
        {
          severity: 'error',
          summary: 'Error',
          text: 'Las contraseñas nuevas no coinciden.',
        },
      ];
      return;
    }

    const usuario_id = this.usuario.id;

    this.infoService
      .changePassword(usuario_id, this.currentPassword, this.newPassword)
      .subscribe({
        next: (res) => {
          this.validationPassword = [
            {
              severity: 'success',
              summary: 'Éxito',
              text: res.message,
            },
          ];
          this.passwordForm.resetForm();
        },
        error: (err) => {
          this.validationPassword = [
            {
              severity: 'error',
              summary: 'Error',
              text: err.error.message,
            },
          ];
        },
      });
  }
}
