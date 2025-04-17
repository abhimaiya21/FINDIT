import Item from '../models/Item.js';
import AppError from '../utils/AppError.js';
import APIFeatures from '../utils/apiFeatures.js';
import logger from '../utils/logger.js';

export const getAllItems = async (req, res, next) => {
  try {
    // Execute query
    const features = new APIFeatures(Item.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const items = await features.query;

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  } catch (err) {
    logger.error(`Get all items error: ${err.message}`);
    next(err);
  }
};

export const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return next(new AppError('No item found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        item
      }
    });
  } catch (err) {
    logger.error(`Get item error: ${err.message}`);
    next(err);
  }
};

export const createItem = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const newItem = await Item.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        item: newItem
      }
    });
  } catch (err) {
    logger.error(`Create item error: ${err.message}`);
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return next(new AppError('No item found with that ID', 404));
    }

    // Check if the user owns the item or is admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('You are not authorized to update this item', 403)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        item
      }
    });
  } catch (err) {
    logger.error(`Update item error: ${err.message}`);
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return next(new AppError('No item found with that ID', 404));
    }

    // Check if the user owns the item or is admin
    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('You are not authorized to delete this item', 403)
      );
    }

    await item.remove();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    logger.error(`Delete item error: ${err.message}`);
    next(err);
  }
};

export const searchItems = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return next(new AppError('Please provide a search query', 400));
    }

    const items = await Item.find({
      $text: { $search: query }
    }).limit(10);

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  } catch (err) {
    logger.error(`Search items error: ${err.message}`);
    next(err);
  }
};

export const getItemsWithinRadius = async (req, res, next) => {
  try {
    const { distance, latlng, unit = 'mi' } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      return next(
        new AppError(
          'Please provide latitude and longitude in the format lat,lng.',
          400
        )
      );
    }

    const items = await Item.find({
      location: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] }
      }
    });

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  } catch (err) {
    logger.error(`Get items within radius error: ${err.message}`);
    next(err);
  }
};

export const getItemStats = async (req, res, next) => {
  try {
    const stats = await Item.aggregate([
      {
        $match: { status: { $ne: 'returned' } }
      },
      {
        $group: {
          _id: '$category',
          numItems: { $sum: 1 },
          numFound: {
            $sum: { $cond: [{ $eq: ['$status', 'found'] }, 1, 0] }
          },
          numLost: {
            $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { numItems: -1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    logger.error(`Get item stats error: ${err.message}`);
    next(err);
  }
};
export const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  } catch (err) {
    next(err);
  }
};