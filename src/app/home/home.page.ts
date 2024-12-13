import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  fechaActual: string;

  icono ="oscuro"
  private storageKey: string = 'usuarios';
  scan : boolean = false;
  scanResult : any = ""
  //resultadoScann : { label:string, value: string }[] = []
  resultadoScann = [
    {
      curso: 'estadistica',
      seccion: '003H',
      profesor: 'juanito perez',
      time: new Date().toLocaleDateString(),
      foto: 'https://cdn-icons-png.flaticon.com/512/746/746960.png'
    },
  ]

  constructor(
      private toast: ToastController,
      private anim: AnimationController,
      private router: Router
  ) {  
    this.fechaActual = this.obtenerFecha();
  }
  

  ngOnInit() {
    this.anim.create()
    .addElement(document.querySelector("#logobarra")!)
    .duration(2000)
    .iterations(Infinity)
    .direction("alternate")
    .fromTo("color", "#fcb32e", "#ffffff")
    .fromTo("transform", "rotate(-10deg)", "rotate(10deg)")
    .play()

  }
  

  obtenerFecha(): string{
    const fechaActual = new Date();
    return fechaActual.toLocaleDateString();
  }

  


  
  cambiarTema(){
    if(this.icono =="oscuro"){
      document.documentElement.style.setProperty("--plomoDuoc","#fcb32e")
      document.documentElement.style.setProperty("--yellowDuoc","#0c0909") // negro
      document.documentElement.style.setProperty("--fondoHora","#0c0909")// negro
      document.documentElement.style.setProperty("--negroDuoc","#0c0909") // negro
      document.documentElement.style.setProperty("--letrasTitulos","#ffffff") // blanco
      document.documentElement.style.setProperty("--letrasTi","#fcb32e") // amarillo
      document.documentElement.style.setProperty("--fondoGeneral","#ababab") // plomo
      document.documentElement.style.setProperty("--plomoSumario","#0c0909") // plomo claro
      document.documentElement.style.setProperty("--bordeAsis","#ffffff") // blanco
      document.documentElement.style.setProperty("--Duoc","#ffffff") //
      this.icono = "claro"  //"claro" fondo oscuro//
    }else{
      document.documentElement.style.setProperty("--plomoDuoc","#4b4c4d")
      document.documentElement.style.setProperty("--yellowDuoc","#fcb32e") // amarillo
      document.documentElement.style.setProperty("--fondoHora","#fcb32e")
      document.documentElement.style.setProperty("--negroDuoc","#ffffff") // blanco
      document.documentElement.style.setProperty("--letrasTitulos","#0c0909") // negro
      document.documentElement.style.setProperty("--letrasTi","#0c0909") // negro
      document.documentElement.style.setProperty("--fondoGeneral","#ffffff") // blanco
      document.documentElement.style.setProperty("--plomoSumario","#c3c6c9") // plomo claro
      document.documentElement.style.setProperty("--bordeAsis","#fcb32e") // blanco
      document.documentElement.style.setProperty("--Duoc","#fcb32e") //
      this.icono = "oscuro"  //"oscuro" fondo claro//
    }
  }


  limpiarLocal(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }



  async CheckPermission() {
    try
      {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          return true;
        }
      
        return false;
      }
      catch(e) // cache de errores
      {
        return undefined;
      }
    }

    async StartScan() {
      if(!this.scan) {
        this.scan = true;
        try 
        {
          const permission = await this.CheckPermission();
          if(!permission) {
            alert("No hay permisos de camara. Activelos manualmente en información de la aplicación")
            this.scan = false
            this.scanResult = "Error. No hay Permisos"
          }else {
            await BarcodeScanner.hideBackground(); // oculta el fondo
            document.querySelector('body')?.classList.add('scanner-active');// agrega una clase al global.scss para ocultar el body principal
            const result = await BarcodeScanner.startScan();
            console.log("Resultado del escaneo: ", result) //Vemos el resultado
            BarcodeScanner.showBackground(); // vuelve a mostrar el fondo
            document.querySelector('body')?.classList.remove('scanner-active');// elimina la clase que nos oculta el body principal
            this.scan = false;
            if(result?.hasContent) { // verifica la exitencia de contenido ( el '?' se utiliza para verificar que la variable no sea null o undefined)
              this.scanResult = result.content;
              this.showToast(result.content);
              const dividirResul = result.content.split("--")
              this.resultadoScann.push({
                curso : dividirResul[0],
                seccion : dividirResul[1],
                profesor : dividirResul[2],
                time: new Date().toLocaleDateString(),
                foto: dividirResul[3]
            })
              /* this.resultadoScann = [
                {label: 'Asignatura', value: dividirResul[0]},
                {label: 'Seccion', value: dividirResul[1]},
                {label: 'Docente', value: dividirResul[2]}
              ]
              console.log(this.resultadoScann)*/
            }
          }
        }
        catch(e)
        {
            console.log(e);
        }
      } else {
        this.StopScan();
      }
    }

    StopScan() {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
      document.querySelector('body')?.classList.remove('scanner-active');
      this.scan = false;
      this.scanResult = ""
    }
  

    async showToast(texto: string) {
      const toast = await this.toast.create({
        message: texto,
        duration: 3000,
        positionAnchor: 'footer2',
        cssClass: 'rounded-toast'
      });
      await toast.present();
    }

}
