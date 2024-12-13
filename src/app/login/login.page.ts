import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, LoadingController,IonRouterOutlet } from '@ionic/angular';


interface Usuario {
  nombre: string;
  clave: string;
  email: string;
  // mejoras
  seccion: string;
  sede: string;
  edad: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
    
  async canDismiss(data?: any, role?: string){
    return role !== 'gesture';
  }

  icono ="oscuro"
  isModalOpen = false   
  /*
  usuarios = [
    {
      nombre: "Benjamín Núñez",
      clave: "benji333",
      email: "benjaminbacan101@gmail.com",
      seccion: "001D",
      sede: "Duoc Melipilla",
      edad: "21"
    },
    {
      nombre: "Juanito Navaja",
      clave: "juanoPito",
      email: "juanitoPerez@gmail.com",
      seccion: "001D",
      sede: "Duoc Melipilla",
      edad: "21"
    },
  ]*/

    // almacenar a usuario en sesion en local storage temporal
    /* en caso de algo malo
    usuarioSesion :any[] = []
    */
    

    // lo que esta en el localstorage se ingresa dentro del array de aca
    usuarios = [
      {
        nombre: localStorage.getItem("nombre"),
        clave: localStorage.getItem("clave"),
        email: localStorage.getItem("email"),
        seccion: localStorage.getItem("seccion"),
        sede: localStorage.getItem("sede"),
        edad: localStorage.getItem("edad")
      },
    ]  
  
  
  nuevoUsuario: Usuario = {
    nombre: '',
    clave: '',
    email: '',
    // nuevo 
    seccion:'',
    sede:'',
    edad:'',
  };

  
  
  constructor(
    private animationCtrl:AnimationController, 
    private elementRef: ElementRef,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private router : Router,
    private renderer: Renderer2) 
 
   
    { 
      const usuariosGuardados = localStorage.getItem('usuarios');
      
      if (usuariosGuardados) {
        this.usuarios = JSON.parse(usuariosGuardados);
      }
    }

  ngOnInit() { 
    
  }



  cambiarTema(){
    if(this.icono =="oscuro"){
      document.documentElement.style.setProperty("--fondo","ffffff")
      document.documentElement.style.setProperty("--fondoTarje","ffffff")
      document.documentElement.style.setProperty("--letraOscuro","#0c0909")
      document.documentElement.style.setProperty("--headerDark","#4b4c4d")
      document.documentElement.style.setProperty("--tituloDark","#ffffff")
      document.documentElement.style.setProperty("--botonDark","#fcb32e")
      document.documentElement.style.setProperty("--letrasTi","black")

      this.icono ="claro"
    }else{
      document.documentElement.style.setProperty("--fondo","#666666")
      document.documentElement.style.setProperty("--fondoTarje", "#777777")
      document.documentElement.style.setProperty("--letraOscuro", "#ffffff")
      document.documentElement.style.setProperty("--headerDark", "#fcb32e")
      document.documentElement.style.setProperty("--tituloDark","#0c0909")
      document.documentElement.style.setProperty("--botonDark","#0c0909")
      document.documentElement.style.setProperty("--letrasTi","white")
      this.icono ="oscuro"
    }
  }

  animarError(index:number){
    this.animationCtrl.create()
    .addElement(document.querySelectorAll("input")[index])
    .duration(200)
    .iterations(3)
    .keyframes([
      {offset:0,transform:"translateX(0px)", boder: "1px transparent solid"},
      {offset:0.25,transform:"translateX(-5px)", boder: "1px red solid"},
      {offset:0.50,transform:"translateX(0px)", boder: "1px transparent solid"},
      {offset:0.75,transform:"translateX(5px)", boder: "1px red solid"},
      {offset:1,transform:"translateX(0px)", boder:  "1px transparent solid"},
    ]).play()

  }

    async animarLogo() {
      const animation = this.animationCtrl
        .create()
        .addElement(this.elementRef.nativeElement)
        .duration(1000)
        .easing('ease-in-out')
        .fromTo('transform', 'scale(0.7)', 'scale(1)');

      await animation.play();
    }

    email = ""
    clave = ""

    /*login(){
      for(let u of this.usuarios) {
        if (u.email == this.email && u.clave == this.clave){
          console.log(`Bienvenido ${u.nombre}!.`)
          this.router.navigate(['/home'])
          this.email = ""
          this.clave = ""
          return;
        }
      }
      console.log("Datos incorrectos");
      alert('Datos no validos, Intentar nuevamente')
    }*/

    // nuevas mejoras de login
    
    login() {
      // esto reduce en tamaño mucho el login con condicional de arriva 
      const usuarioEncontrado = this.usuarios.find(u => u.email === this.email && u.clave === this.clave);
      const mensajeErrorCorreo = this.elementRef.nativeElement.querySelector("#mensajerrorcore");
      const mensajeErrorClave = this.elementRef.nativeElement.querySelector("#mensajerrorclave");
      
      if (this.email.length > 30){
        this.renderer.setProperty(mensajeErrorCorreo, 'innerText', 'Por favor, no supere los 30 caracteres');
        this.renderer.setStyle(mensajeErrorCorreo, 'color', '#fcb32e');  
        this.email = "";
        return;
      }
      
      if (this.email.length <= 0 && this.clave.length <= 0){
        this.renderer.setProperty(mensajeErrorCorreo, 'innerText', 'Por favor, rellene el campo de correo');
        this.renderer.setStyle(mensajeErrorCorreo, 'color', '#fcb32e');
        this.renderer.setProperty(mensajeErrorClave, 'innerText', 'Por favor, rellene el campo de clave');
        this.renderer.setStyle(mensajeErrorClave, 'color', '#fcb32e');      
        return;
      }
      
      if (this.clave.length > 30){
        this.renderer.setProperty(mensajeErrorClave, 'innerText', 'Por favor, no supere los 30 caracteres');
        this.renderer.setStyle(mensajeErrorClave, 'color', '#fcb32e');  
        this.clave = "";
        return;
      }
      

      if(this.email.length > 0 && this.clave.length <= 0){
        this.renderer.setProperty(mensajeErrorCorreo, 'innerText', '');
        this.renderer.setProperty(mensajeErrorClave, 'innerText', 'ingresar clave, por favor');
        this.renderer.setStyle(mensajeErrorClave, 'color', '#fcb32e');
        return;
      }
      
      if(this.email.length <= 0 && this.clave.length > 0){
        this.renderer.setProperty(mensajeErrorCorreo, 'innerText', 'ingresar correo por favor');
        this.renderer.setProperty(mensajeErrorClave, 'innerText', '');
        this.renderer.setStyle(mensajeErrorClave, 'color', '#fcb32e');
        return;
      }
            
      if (!usuarioEncontrado){
        alert("correo o clave no encontrado dentro de localstorage, verificar o crear nuevo usuario");
        this.renderer.setProperty(mensajeErrorCorreo, 'innerText', '');
        this.renderer.setProperty(mensajeErrorClave, 'innerText', '');
        this.clave = "";
        return;
      }
  
      if (usuarioEncontrado) {
        this.router.navigate(['/home']);
        nombre : usuarioEncontrado.nombre;
        seccion : usuarioEncontrado.seccion;
        this.renderer.setProperty(mensajeErrorCorreo, 'innerText', '');
        this.renderer.setProperty(mensajeErrorClave, 'innerText', '');
        this.email = "";
        this.clave = "";
      }
    
    }

    // ...........................

    limpiarRegistro(){
      this.nuevoUsuario.nombre = "";
      this.nuevoUsuario.clave = "";
      this.nuevoUsuario.email = "";
      this.nuevoUsuario.seccion = "";
      this.nuevoUsuario.sede = "";
      this.nuevoUsuario.edad = "";
    }

    // ...........................
    
    

    // ...........................
    
    
    registrarUsuario() {
      // Validar que todos los campos estén completos
      
      if (this.nuevoUsuario.nombre.length <= 0 && this.nuevoUsuario.email.length <= 0 && this.nuevoUsuario.clave.length <= 0
        && this.nuevoUsuario.seccion.length <= 0 && this.nuevoUsuario.sede.length <= 0 && this.nuevoUsuario.edad.length <= 0
      ){
        alert('NO HAY NADA , rellene los campos');
        return;
      }
      
      //-----------------------------------------------------
      
      if (this.nuevoUsuario.nombre.length <= 0 ){
        alert('completar campo nombre');
        return;
      }
      
      if (this.nuevoUsuario.nombre.length > 30 ){
        alert('campo nombre solo acepta maximo de 30 caracteres');
        this.nuevoUsuario.nombre = ""
        return;
      }

      //-----------------------------------------------------
      
      if (this.nuevoUsuario.clave.length <= 0 ){
        alert('completar clave nombre');
        return;
      }
      
      if (this.nuevoUsuario.clave.length > 8 ){
        alert('campo clave presenta maximo de 8 caracteres');
        this.nuevoUsuario.clave = ""
        return;
      }
      
      //-----------------------------------------------------
       
      if (this.nuevoUsuario.email.length <= 0 ){
        alert('completar email nombre');
        return;
      }
      
      if (this.nuevoUsuario.email.length > 30 ){
        alert('ampo email presenta maximo de 30 caracteres');
        this.nuevoUsuario.email = "";
        return;
      }

      //-----------------------------------------------------
      
      if (this.nuevoUsuario.seccion.length <= 0 ){
        alert('completar seccion nombre');
        return;
      }
      if (this.nuevoUsuario.seccion.length > 5 ){
        alert('campo seccion presenta maximo de 5 caracteres');
        this.nuevoUsuario.seccion = "";
        return;
      }
        
      //-----------------------------------------------------
      
      if (this.nuevoUsuario.sede.length <= 0 ){
        alert('completar sede nombre');
        return;
      }
      
      if (this.nuevoUsuario.sede.length > 30 ){
        alert('campo sede presenta maximo de 30 caracteres');
        this.nuevoUsuario.sede = "";
        return;
      }
      
      //-----------------------------------------------------
      
      if (this.nuevoUsuario.edad.toString().length <= 0 ){
        alert('completar edad nombre');
        return;
      }
      
      if (this.nuevoUsuario.edad.toString().length > 2 ){
        alert('campo edad solo soporta un maximo de 2 digitos, las personas de 100 años ya no estudian ;)  ');
        this.nuevoUsuario.edad = "";
        return;
      }
      
      
      //-----------------------------------------------------
      
      
      if (this.nuevoUsuario.nombre && this.nuevoUsuario.clave && this.nuevoUsuario.email && 
          this.nuevoUsuario.seccion && this.nuevoUsuario.sede && this.nuevoUsuario.edad) {
        // Agregar el nuevo usuario al array
        this.usuarios.push({ ...this.nuevoUsuario });
        // Guardar el array de usuarios actualizado en localStorage
        // .... 
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        // .....
        alert('usuario ingresado correctamente')
        // Limpiar los campos del formulario
        this.nuevoUsuario.nombre = '';  
        this.nuevoUsuario.clave = '';
        this.nuevoUsuario.email = '';
        this.nuevoUsuario.seccion = '';
        this.nuevoUsuario.sede = '';
        this.nuevoUsuario.edad = '';
      }
      
    }
    
    
    
    // ..........................

    
    
    async resetPassword(){
      const loading = await this.loadingCtrl.create({
        message: 'Loading...'
      });
      for (let u of this.usuarios){
        if(u.email == this.email){
          loading.present()
          let nueva = Math.random().toString(36).slice(-6)
          u.clave = nueva
          let body = {
            "nombre": u.nombre,
            "app":"RegistraPP",
            "clave":nueva,
            "email":u.email
          }
          this.http.post("https://myths.cl/api/reset_password.php",body)
          .subscribe((data)=>{
            loading.dismiss()
            alert('correo enviado correctamente')
            console.log(data)
          })
          return;
        }
      }
      loading.dismiss()
    }


  }