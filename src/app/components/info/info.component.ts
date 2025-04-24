import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfoService } from './info.service';
import { UserData } from '../../interfaces/user';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

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
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit {
  userInitial: string = '';
  usuario: UserData = {
    id: '',
    nombre: '',
    apellidos: '',
    email: '',
    fecha_registro: new Date(),
    rol: '',
  };

  config = {
    temaOscuro: false,
    notificaciones: true,
  };

  constructor(private infoService: InfoService) {}

  cerrarSesion() {
    console.log('Cerrar sesión');
    // Aquí pones tu lógica real para cerrar sesión
  }

  cambiarContrasena() {
    console.log('Cambiar contraseña');
    // Redireccionas o abres modal
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
}
