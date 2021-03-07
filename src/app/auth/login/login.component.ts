import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy{
  loginForm: FormGroup;
  cargando = false;
  uiSubs: Subscription;

  constructor(private fb: FormBuilder,
              private router: Router,
              private store: Store<AppState>,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
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

  loginUsuario() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch( ui.isLoading() );
    // Swal.fire({
    //   title: 'Ingresando..',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });
    const { email, password } = this.loginForm.value;

    this.authService.loginUsuario(email, password)
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
