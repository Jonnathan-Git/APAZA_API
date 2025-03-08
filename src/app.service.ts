import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo(): string {
    return 'Este proyecto apoya a la organización APAZA con la colaboración del TCU-663 y TCU-751 Guápiles.\n\nEstudiantes participantes:\n- Jeikel Medrano\n- Jonnathan García\n- Elías Mena\n- Diego Ríos';
  }
}
