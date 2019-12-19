const BaseService = require('./BaseService');
const { cloudinary } = require('../config/cloudinaryConfig');

class CloudinaryService extends BaseService {
  constructor() {
    super(CloudinaryService);
  }

  async uploadProfilePhoto(path, id) {
    await cloudinary.uploader.upload(path, {
      public_id: `user-${id}`
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
}

const CloudinaryServiceInstance = new CloudinaryService();

module.exports = CloudinaryServiceInstance;
