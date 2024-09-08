import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";

export function imageValidator() {
   return new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // Límite de tamaño de 1 KB
      new FileTypeValidator({ fileType: 'image/jpeg' }), // Solo acepta archivos JPG
    ],
  });
}