import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Gallery {
  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  images: string[];
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);