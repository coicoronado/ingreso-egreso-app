import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as ui from '../../shared/ui.actions';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;
  cargando = false;
  uiSubs: Subscription;

  constructor(private fb: FormBuilder,
              private router: Router,
              private store: Store<AppState>,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubs = this.store.select('ui').subscribe((uiResp) => {
      this.cargando = uiResp.isLoading;
      console.log('cargando subs');
    });
  }

  ngOnDestroy(): void {
    console.log('destruyendo');
    this.uiSubs.unsubscribe();
  }

  crearUsuario() {
    if (this.registroForm.invalid) { return; }

    this.store.dispatch( ui.isLoading() );
    // Swal.fire({
    //   title: 'Registrando..',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });
    const { nombre, email, password } = this.registroForm.value;

    this.authService.crearUsuario(nombre, email, password)
    .then(credenciales => {
      console.log(credenciales);
      // Swal.close();
      this.store.dispatch( ui.stopLoading() );
      this.router.navigate(['/']);
    })
    .catch(error => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message
      });
    });
  }

}
