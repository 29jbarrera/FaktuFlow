import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
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
import { AuthService } from '../../pages/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
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
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  providers: [MessageService, ConfirmationService],
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

  constructor(
    private infoService: InfoService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

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
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se han actualizado los datos exitosamente.',
            life: 4000,
          });

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

  deleteAccountConfirm(): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar esta cuenta? Esta acción es irreversible y eliminará todos los datos asociados de manera permanente.`,
      header: 'Confirmación de eliminación de cuenta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar cuenta',
      acceptButtonStyleClass: 'p-button danger',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button cancel',
      accept: () => {
        this.deleteAccount();
      },
      reject: () => {},
    });
  }

  deleteAccount(): void {
    const usuario_id = this.authService.getUserId();
    if (usuario_id !== null) {
      this.infoService.deleteUser(usuario_id).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cuenta Eliminada',
            detail: 'La cuenta ha sido eliminada exitosamente.',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2500);
        },
        (error) => {}
      );
    } else {
    }
  }

  logoutConfirm(): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas cerrar la sesión?`,
      header: 'Cerrar sesión',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button danger',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button cancel',
      accept: () => {
        this.logout();
      },
      reject: () => {},
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    window.location.reload();
  }
}
