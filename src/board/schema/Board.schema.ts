import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Board {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;

  @Prop({default: 'test'})
  photo: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);