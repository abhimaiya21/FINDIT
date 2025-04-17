import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'An item must have a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'An item must have a description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'An item must belong to a category'],
      enum: [
        'electronics',
        'clothing',
        'books',
        'furniture',
        'jewelry',
        'other'
      ]
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    lostDate: {
      type: Date,
      required: [true, 'Please provide the date when the item was lost']
    },
    images: [String],
    status: {
      type: String,
      enum: ['lost', 'found', 'returned'],
      default: 'lost'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An item must belong to a user']
    },
    contactEmail: {
      type: String,
      validate: {
        validator: function (email) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    contactPhone: String,
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for geospatial queries
itemSchema.index({ location: '2dsphere' });

// Index for text search
itemSchema.index({ title: 'text', description: 'text' });

// Query middleware to populate user data
itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email avatar'
  });
  next();
});

const Item = mongoose.model('Item', itemSchema);

export default Item;