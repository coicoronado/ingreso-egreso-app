import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../modelos/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
              private store: Store,
              private firestore: AngularFirestore) { }

  initAuthListener () {
    this.auth.authState
    .subscribe(fuser => {
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe((firestoreUser: any) => {
          console.log(firestoreUser);
          const user = Usuario.fromFirestore(firestoreUser);
          this.store.dispatch(authActions.setUser({user}));
        });
      } else {
        this.userSubscription?.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }

    })
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
              const newUser = new Usuario(user.uid, nombre, user.email);
              return this.firestore.doc(`${user.uid}/usuario`)
                .set({...newUser});
            });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }
}
