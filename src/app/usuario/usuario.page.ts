import { Component, OnInit } from '@angular/core';
import { AnimationController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  //guardando los usuario de local
  
  user: any [] = []
  
  constructor(
    private toast: ToastController,
    private animation: AnimationController
  ) { }


  ngOnInit() {
    this.animation.create()
    .addElement(document.querySelector("#logobarra1")!)
    .duration(2000)
    .iterations(Infinity)
    .direction("alternate")
    .fromTo("color", "#fcb32e", "#ffffff")
    .fromTo("transform", "rotate(-10deg)", "rotate(10deg)")
    .play()

    const usuariosGuardados = localStorage.getItem('usuarios');

    if (usuariosGuardados) {
      this.user = JSON.parse(usuariosGuardados);
    }
  
  }





}