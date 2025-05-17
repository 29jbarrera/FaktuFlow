import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/user';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { environment_prod } from '../../../environments/environment';
import { LandingPageService } from '../landing-page/landing-page.service';
import { ValidationMessage } from '../../interfaces/validation-message.interface';
import { ResetPasswordService } from '../reset-password/reset-password.service';
import { LoadingComponent } from '../../components/loading/loading.component';

declare var grecaptcha: any;

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
    FormsModule,
    MessageModule,
    DialogModule,
    InputOtpModule,
    LoadingComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  providers: [MessageService],
})
export class AuthComponent implements OnInit {
  @ViewChild('registerForm') registerForm!: NgForm;
  @ViewChild('resendForm') resendForm!: NgForm;
  @ViewChild('resendFormForgot') resendFormForgot!: NgForm;
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  emailRegister: string = '';
  password: string = '';
  passwordRegister: string = '';
  passwordRegisterConfirm: string = '';
  messagesLogin: any[] = [];
  messagesRegister: any[] = [];

  loading = false;
  loadingRegister = false;
  loadingResetPassword = false;
  loadingVerifyCode = false;
  loadingReenviarCode = false;

  openDialog = false;
  messagesVerify: any[] = [];
  emailVerify: string = '';
  CodeToVerify: string = '';

  openDialogForgot = false;
  messagesResendForgot: ValidationMessage[] = [];
  emailResentForgot: string = '';

  recaptchaSiteKey = environment_prod.siteKey;

  // Función para validar el formato del correo
  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private landingPageService: LandingPageService,
    private resetPasswordService: ResetPasswordService
  ) {}

  ngOnInit(): void {
    this.landingPageService.pingBackend().subscribe();
    this.loadRecaptchaScript();
  }

  private loadRecaptchaScript() {
    const existingScript = document.getElementById('recaptcha-script');
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.id = 'recaptcha-script';
    document.head.appendChild(script);
  }

  async onLogin(): Promise<void> {
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
      this.messagesLogin = [
        {
          severity: 'error',
          summary: 'Error',
          text: 'Por favor, verifica que no eres un robot.',
        },
      ];
      return;
    }

    if (!this.email || !this.password) {
      this.messagesLogin = [
        {
          severity: 'error',
          summary: 'Error',
          text: 'Por favor, completa todos los campos',
        },
      ];
      return;
    }

    if (!this.isEmailValid(this.email)) {
      this.messagesLogin = [
        {
          severity: 'error',
          summary: 'Error',
          text: 'Formato inválido del correo',
        },
      ];
      return;
    }

    try {
      this.loading = true;
      const response: any = await this.authService
        .login(this.email, this.password, recaptchaResponse)
        .toPromise();

      this.authService.storeUserData(response);

      this.messagesLogin = [
        {
          severity: 'success',
          summary: 'Inicio de sesión',
          text: '¡Bienvenido!',
        },
      ];
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.loading = false;
      if (error?.error?.[0]?.msg === 'El email no es válido') {
        this.messagesLogin = [
          {
            severity: 'error',
            summary: 'Error',
            text: 'El formato del correo electrónico es incorrecto',
          },
        ];
      } else if (error?.error?.message === 'Credenciales inválidas') {
        this.messagesLogin = [
          {
            severity: 'error',
            summary: 'Error',
            text: 'Correo o contraseña incorrectos',
          },
        ];
      } else {
        this.messagesLogin = [
          {
            severity: 'error',
            summary: 'Error en el servidor',
            text:
              error?.error?.message ||
              'Hubo un problema al iniciar sesión. Intenta nuevamente',
          },
        ];
      }
      grecaptcha.reset();
      this.loading = false;
    }
  }

  async onRegisterSubmit(form: NgForm): Promise<void> {
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
          text: 'Por favor, completa todos los campos',
        },
      ];
      return;
    }

    if (this.passwordRegister !== this.passwordRegisterConfirm) {
      this.messagesRegister = [
        {
          severity: 'error',
          summary: 'Error',
          text: 'Las contraseñas no coinciden',
        },
      ];
      return;
    }

    try {
      this.loadingRegister = true;

      const user: User = {
        nombre: this.nombre,
        apellidos: this.apellidos,
        email: this.emailRegister,
        password: this.passwordRegister,
      };

      const response = await this.authService.register(user).toPromise();

      if (!response) {
        this.loadingRegister = false;
        this.messagesRegister = [
          {
            severity: 'error',
            summary: 'Error',
            text: 'No se recibió respuesta del servidor',
          },
        ];
        return;
      }
      this.loadingRegister = true;
      this.messagesRegister = [
        {
          severity: 'success',
          summary: 'Registro exitoso',
          text: '¡Te has registrado correctamente!',
        },
      ];

      form.resetForm();
      this.loadingRegister = false;
      setTimeout(() => {
        this.openDialog = true;
      }, 2800);
    } catch (error: any) {
      this.loadingRegister = false;
      console.error('Error en registro:', error);

      if (error?.error?.errors && Array.isArray(error.error.errors)) {
        this.messagesRegister = error.error.errors.map((err: any) => ({
          severity: 'error',
          summary: 'Error',
          text: err.msg,
        }));
      } else {
        this.messagesRegister = [
          {
            severity: 'error',
            summary: 'Error',
            text: error?.error?.message || 'Error en el servidor',
          },
        ];
      }
      this.loadingRegister = false;
    }
  }

  openModalVerifyCode() {
    this.openDialog = true;
  }

  verifyCode(form: NgForm) {
    this.loadingVerifyCode = true;
    this.authService.verifyCode(this.emailVerify, this.CodeToVerify).subscribe({
      next: (res) => {
        this.messagesVerify = [
          {
            severity: 'success',
            text: res.message || 'Cuenta verificada con éxito.',
          },
        ];

        this.CodeToVerify = '';
        form.resetForm();
        this.loadingVerifyCode = false;
        setTimeout(() => {
          this.openDialog = false;
        }, 3000);
      },
      error: (err) => {
        this.loadingVerifyCode = false;
        this.messagesVerify = [
          { severity: 'error', text: err.error.message || 'Código incorrecto' },
        ];
      },
    });
  }

  resendVerificationCode() {
    this.loadingReenviarCode = true;
    this.authService.resendCode(this.emailVerify).subscribe({
      next: (res) => {
        this.messagesVerify = [
          {
            severity: 'info',
            text: res.message || 'Código reenviado con éxito',
          },
        ];
        this.loadingReenviarCode = false;
      },
      error: (err) => {
        this.loadingReenviarCode = false;
        this.messagesVerify = [
          {
            severity: 'error',
            text: err.error.message || 'Error al reenviar el código',
          },
        ];
      },
    });
  }

  openModalForgot() {
    this.openDialogForgot = true;
  }

  resendEmailForgot(form: NgForm) {
    this.loadingResetPassword = true;
    this.messagesResendForgot = [];

    if (form.invalid || !this.emailResentForgot) {
      this.loadingResetPassword = false;
      this.messagesResendForgot = [
        {
          severity: 'error',
          summary: 'Email requerido',
          text: 'Por favor introduce un email válido para continuar.',
        },
      ];
      return;
    }
    this.loadingResetPassword = true;
    this.resetPasswordService.forgotPassword(this.emailResentForgot).subscribe({
      next: (res) => {
        this.messagesResendForgot = [
          {
            severity: 'success',
            summary: 'Enlace enviado',
            text: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico.',
          },
        ];
        form.resetForm();
        this.loadingResetPassword = false;
        setTimeout(() => {
          this.openDialogForgot = false;
          this.emailResentForgot = '';
        }, 5000);
      },
      error: (err) => {
        this.loadingResetPassword = false;
        this.messagesResendForgot = [
          {
            severity: 'error',
            summary: 'Error',
            text: err.error.message || 'Ocurrió un error al enviar el enlace.',
          },
        ];
      },
    });
  }
}
