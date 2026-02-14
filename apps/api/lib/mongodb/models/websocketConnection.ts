import 'reflect-metadata';
import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';

@index({ connectionId: 1 }, { unique: true })
@index({ userId: 1 })
@index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    customName: 'WebSocketConnection',
  },
})
class WebSocketConnectionModel {
  @prop({ required: true, trim: true })
  connectionId!: string;

  @prop({ required: true, trim: true })
  userId!: string;

  @prop({ required: true, trim: true })
  domainName!: string;

  @prop({ required: true, trim: true })
  stage!: string;

  @prop({ required: true })
  connectedAt!: Date;

  @prop({ required: true })
  lastSeenAt!: Date;

  @prop()
  expiresAt?: Date;
}

const WebSocketConnection = getModelForClass(WebSocketConnectionModel);

export type WebSocketConnectionEntity = WebSocketConnectionModel;
export default WebSocketConnection;
