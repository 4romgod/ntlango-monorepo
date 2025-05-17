import { EventCategoryGroupType } from '@/graphql/types/eventCategoryGroup';
import {kebabCase} from 'lodash';
import {model, Schema, Document, CallbackWithoutResultAndOptionalError, CallbackError} from 'mongoose';

export const EventCategoryGroupSchema = new Schema<EventCategoryGroupType & Document>(
  {
    eventCategoryGroupId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventCategoryList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'EventCategory',
        required: true,
        index: true,
      },
    ],
  },
  {timestamps: true},
);

EventCategoryGroupSchema.pre('validate', async function (next: CallbackWithoutResultAndOptionalError) {
  try {
    this.eventCategoryGroupId = this._id!.toString();
    if (this.isModified('name')) {
      this.slug = kebabCase(this.name);
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const EventCategoryGroup = model('EventCategoryGroup', EventCategoryGroupSchema);

export default EventCategoryGroup;
