import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ValidationMessage } from '../../interfaces/validation-message.interface';
import { PasswordModule } from 'primeng/password';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    CommonModule,
    ToastModule,
    MessageModule,
    InputGroupAddonModule,
    ButtonModule,
    PasswordModule,
    InputGroupModule,
    LoadingComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [MessageService],
})
export class ResetPasswordComponent {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  message: string = '';

  loading = false;

  validationResetPassword: ValidationMessage[] = [];

  constructor(
    private resetPasswordService: ResetPasswordService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  onResetPassword() {
    this.loading = true;
    if (!this.newPassword || this.newPassword.length < 6) {
      this.loading = false;
      this.validationResetPassword = [
        {
          severity: 'error',
          summary: 'Contraseña inválida',
          text: 'La nueva contraseña debe tener al menos 6 caracteres.',
        },
      ];
      return;
    }

    this.resetPasswordService
      .resetPassword(this.email, this.token, this.newPassword)
      .subscribe({
        next: () => {
          this.loading = true;
          this.validationResetPassword = [
            {
              severity: 'success',
              summary: 'Éxito',
              text: 'Tu contraseña ha sido restablecida correctamente. Redirigiendo...',
            },
          ];
          this.router.navigate(['/login']);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.validationResetPassword = [
            {
              severity: 'error',
              summary: 'Error',
              text:
                err.error.message ||
                'Ocurrió un error al restablecer la contraseña.',
            },
          ];
        },
      });
  }
}
