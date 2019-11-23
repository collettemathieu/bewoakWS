import { Injectable } from '@angular/core';
import * as generator from 'generate-password-browser';

@Injectable()
export class UserPasswordService {

  constructor() { }

  /**
   * Génération d'un mot de passe aléatoire
   */
  generatePassword(): string {
    return 'rednecks';
    return generator.generate({
      length: 10,
      numbers: true
    });
  }
}
