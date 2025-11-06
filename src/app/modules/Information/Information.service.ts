
import { IInformation } from './Information.interface';
import InformationModel from './Information.model';
import ApiError from '../../errors/ApiError';
import cloudinary from '../../helper/cloudinary';
import { Request } from 'express';
//import convertUTCtimeString from '../../utils/convertUTCtimeString';
import uploadImage from '../../utils/uploadImage';

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
      "facebook": "https://www.facebook.com/",
      "age": 21,
      "countDownDate": "2025-09-12T07:31:45.137+00:00",
      "countDownImg": "https://res.cloudinary.com/dwok2hmb7/image/upload/v1757327095/NMP-Ecommerce/moltzcyv0wfpbiigq6o2.jpg",
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
    //const file = req.file as Express.Multer.File;
    // const cloudinaryRes = await cloudinary.uploader.upload(file.path, {
    //   folder: 'NMP-Ecommerce',
    //   // width: 300,
    //   // crop: 'scale',
    // });
    image = await uploadImage(req);
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

const updateCountDownImgService = async (req: Request) => {
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
    { countDownImg: image },
    { runValidators: true }
  );

  return result;
}

const updateCountDownTimeService = async (payload: {date:string, time: string}) => {

 const countDownDate = new Date(payload.date);
 const hours = payload.time.split(":")[0]
 const minutes = payload.time.split(":")[1]
 const seconds = payload.time.split(":")[2]
 

 //convert local Date as utc Date// by default new Date() converts the local date time into utc date time
  const countDownUTCDate = new Date(
    Date.UTC(
      countDownDate.getUTCFullYear(),
      countDownDate.getUTCMonth(),
      countDownDate.getUTCDate(),
      Number(hours), //
      Number(minutes),
      Number(seconds),
    )
  );

  const result = await InformationModel.updateOne(
    {},
    { countDownDate: countDownUTCDate },
    { runValidators: true }
  );
}


export {
  createInformationService,
  getInformationService,
  updateHeroImgService,
  updateCountDownImgService,
  updateCountDownTimeService
};
