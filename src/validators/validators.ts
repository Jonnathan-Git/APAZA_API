import {FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";

export function imageValidator() {
  return new ParseFilePipe({
    fileIsRequired: false, // Permite que el archivo sea opcional
    validators: [
      new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // Límite de tamaño de 1 KB
      new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ })
    ],
  });
}