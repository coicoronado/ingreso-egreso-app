import { createAction, props } from '@ngrx/store';
import { Usuario } from '../modelos/usuario.model';

export const setUser = createAction(
  '[Auth] setUser',
  props<{user: Usuario}>()
);

export const unSetUser = createAction('[Auth] unSetUser');
