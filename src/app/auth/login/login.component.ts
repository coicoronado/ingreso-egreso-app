import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  loginUsuario() {
    if (this.loginForm.invalid) { return; }

    Swal.fire({
      title: 'Ingresando..',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
    const { email, password } = this.loginForm.value;

    this.authService.loginUsuario(email, password)
    .then(credenciales => {
      console.log(credenciales);
      Swal.close();
      this.router.navigate(['/']);
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message
      });
    });
  }

}
