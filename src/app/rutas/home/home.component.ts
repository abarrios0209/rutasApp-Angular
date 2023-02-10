import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Respuesta } from 'src/app/interface/respuesta.interface';
import { Flight } from 'src/app/interface/ruta.interfaces';
import { RutasServicesService } from 'src/app/services/rutas-services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  validador: boolean = true;
  rutasServicio!: Respuesta[];
  rutaDirecta: Respuesta[] = [];
  rutaInicial: Respuesta[] = [];
  rutaFinal: Respuesta[] = [];
  tipoMoneda: string[] = ['Peso', 'Dolar', 'Euro'];
  moneda: number = 0;
  monedas: number = 0;
  validarViaje:boolean = false;

  miFormulario: FormGroup = this.fb.group({
    origen: ['', [Validators.required]],
    destino: ['', [Validators.required]],
    moneda: [],
  });

  constructor(
    private fb: FormBuilder,
    private rutasServices: RutasServicesService
  ) {}

  ngOnInit() {
    this.obtenerRutas();
  }

  obtenerRutas() {
    this.rutasServices.obtenerRutas().subscribe((ruta) => {
      console.log(ruta);
      this.rutasServicio = ruta;
    });
  }

  cambioMoneda(event: any) {
    console.log(event);
    if (this.rutaDirecta.length != 0) {
      if (event == 'Dolar') {
        this.moneda = this.rutaDirecta[0].price;
      } else if (event == 'Euro') {
        this.moneda = this.rutaDirecta[0].price * 0.94;
        console.log(this.moneda);
      } else if (event == 'Peso') {
        this.moneda = this.rutaDirecta[0].price;
        this.moneda = this.moneda * 4774;
        console.log(this.moneda);
      }
    }
  }

  getObtenerPrecio(rutai: Respuesta) {
    let moneda;
    switch (this.miFormulario.get('moneda')?.value) {
      case 'Peso':
        moneda = rutai.newPricePeso;
      break;
      case 'Dolar':
        moneda = rutai.newPrice;
      break;
      case 'Euro':
        moneda = rutai.newPriceEuro;
      break;

      default:
        moneda = rutai.newPrice
      break;
    }
    return moneda;
  }

  mayusOrigen(control: any) {
    console.log(control.miFormulario.value.origen);
    if (/[a-z]/.test(control.miFormulario.value.origen)) {
      control.miFormulario.value.origen =
        control.miFormulario.value.origen.toUpperCase();
      this.miFormulario
        .get('origen')
        ?.setValue(control.miFormulario.value.origen);
      console.log(this.miFormulario.value);
    }
  }

  mayusDestino(control: any) {
    console.log(control);
    if (/[a-z]/.test(control.miFormulario.value.destino)) {
      control.miFormulario.value.destino =
        control.miFormulario.value.destino.toUpperCase();
      this.miFormulario
        .get('destino')
        ?.setValue(control.miFormulario.value.destino);
      console.log(this.miFormulario.value);
    }
  }

  validarCampo() {
    this.validador =
      this.miFormulario.get('origen')?.value.toUpperCase() ===
      this.miFormulario.get('destino')?.value.toUpperCase()
        ? false
        : true;
    if (this.validador) {
      this.buscar();
    }
  }

  buscar() {
    this.rutaDirecta = this.rutasServicio.filter(
      (ruta) =>
        ruta.departureStation === this.miFormulario.get('origen')?.value &&
        ruta.arrivalStation === this.miFormulario.get('destino')?.value
    );
    if (this.rutaDirecta.length > 0) {
      this.moneda = this.rutaDirecta[0].price;
      this.validarViaje = false;
    }
    let rutaOrigenDos = [];
    this.rutaInicial = [];
    this.rutaFinal = [];
    let rutaOrigentres = [];
    if (this.rutaDirecta.length === 0) {
      rutaOrigenDos = this.rutasServicio.filter(
        (ruta) =>
          ruta.departureStation === this.miFormulario.get('origen')?.value
      );
      rutaOrigenDos.forEach((res) => {
        rutaOrigentres = this.rutasServicio.filter(
          (ruta) => ruta.departureStation === res.arrivalStation
        );
        rutaOrigentres.forEach((rta) => {
          if (rta.arrivalStation === this.miFormulario.get('destino')?.value) {
            let rtaCom = this.rutasServicio.filter(
              (ruta) => ruta.arrivalStation === rta.departureStation
            );
            rtaCom.forEach((init) => {
              if (
                init.departureStation === this.miFormulario.get('origen')?.value
              ) {
                this.rutaInicial.push(init);
                console.log(this.rutaInicial);
              }
            });
            this.rutaFinal.push(rta);
            console.log(this.rutaFinal);
            /* this.rutaFinal.map(ruta => (ruta.PRECIO_POS * sku.CANTIDAD_DEVOLVER)).reduce((prev, curr) => prev + curr, 0) */
          }
        });
      });
      this.rutaInicial.forEach((rutI) => {
        let valor = this.rutaFinal.find(
          (rutF) => rutI.arrivalStation === rutF.departureStation
        );
        rutI.newPrice = rutI.price + (valor ? valor?.price : 0);
        rutI.newPricePeso = rutI.newPrice * 4774;
        rutI.newPriceEuro = rutI.newPrice * 0.94;
        console.log(valor);
      });
      console.log(this.rutaInicial);
      if(this.rutaInicial.length === 0 || this.rutaFinal.length === 0){
        this.validarViaje = true;
      }else{
        this.validarViaje = false;
      }
    }
  }
}
