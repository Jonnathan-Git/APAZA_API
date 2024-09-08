import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Event {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ default: 'recreativo' })
    type: string;

    @Prop({default: 'test'})
    image: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);