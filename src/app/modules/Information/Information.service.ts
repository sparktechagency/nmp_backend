
import { IInformation } from './Information.interface';
import InformationModel from './Information.model';
import ApiError from '../../errors/ApiError';
import cloudinary from '../../helper/cloudinary';
import { Request } from 'express';

const createInformationService = async (
  payload: IInformation,
) => {
  //check information
  const information = await InformationModel.findOne();

  if (information) {
    const result = await InformationModel.updateOne(
      {},
      payload,
      { runValidators: true }
    );
    return result;
  }

  const result = await InformationModel.create(payload);
  return result;
};

const getInformationService = async () => {
  const result = await InformationModel.findOne().select("-createdAt -updatedAt -_id");
  if (!result) {
    return {
      "title": "Transform Every Puff into Pure Satisfaction",
      "subTitle": "Explore Our Premium Collection of Vapes and Accessories That Deliver Unmatched Quality and Flavor.",
      "heroImg": "https://res.cloudinary.com/dwok2hmb7/image/upload/v1757327095/NMP-Ecommerce/moltzcyv0wfpbiigq6o2.jpg",
      "email": "supportnmp@gmail.com",
      "phone": "01823969823",
      "address": "Washition",
      "instagram": "https://www.instagram.com/",
      "facebook": "https://www.facebook.com/"
    }
  }
  return result;
};


const updateHeroImgService = async (req: Request) => {
  const file = req?.file as Express.Multer.File;
  if (!file) {
    throw new ApiError(400, "Upload image");
  }

  //upload a image
  let image: string = "";
  if (req.file && (req.file as Express.Multer.File)) {
    const file = req.file as Express.Multer.File;
    const cloudinaryRes = await cloudinary.uploader.upload(file.path, {
      folder: 'NMP-Ecommerce',
      // width: 300,
      // crop: 'scale',
    });
    image = cloudinaryRes?.secure_url;
    // fs.unlink(file.path);
  }

  if (!image) {
    throw new ApiError(400, "upload a image")
  }

  const result = await InformationModel.updateOne(
    { },
    { heroImg: image },
    { runValidators: true }
  );

  return result;
}


export {
  createInformationService,
  getInformationService,
  updateHeroImgService
};
