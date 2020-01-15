const BaseService = require('./BaseService');
const { cloudinary } = require('../config/cloudinaryConfig');

class CloudinaryService extends BaseService {
  constructor() {
    super(CloudinaryService);
  }

  async uploadProfilePhoto(path, id) {
    return await cloudinary.uploader.upload(path, {
      public_id: `user-${id}`,
      width: 200,
      height: 200,
      gravity: 'face',
      crop: 'thumb'
    });
  }

  async uploadProductImages(images) {
    return await Promise.all(
      images.map(async image => {
        const { secure_url } = await cloudinary.uploader.upload(image.path);
        return secure_url;
      })
    );
  }

  async deleteImage(public_id) {
    return await cloudinary.uploader.destroy(public_id);
  }
}

const CloudinaryServiceInstance = new CloudinaryService();

module.exports = CloudinaryServiceInstance;
