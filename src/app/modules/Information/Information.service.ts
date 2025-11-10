
import { IInformation, IMapLoaction } from './Information.interface';
import InformationModel from './Information.model';
import ApiError from '../../errors/ApiError';
import cloudinary from '../../helper/cloudinary';
import { Request } from 'express';
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
  const result = await InformationModel.aggregate([
    {
      $addFields: {
        longitude: {
          $arrayElemAt: [ "$location.coordinates", 1],
        },
        latitude: {
          $arrayElemAt: [ "$location.coordinates", 0],
        }
      }
    },
    {
      $project: {
        _id:0,
        location:0
      }
    }
  ]);

  if (result.length === 0) {
    return {
      "title": "",
      "subTitle": "",
      "email": "",
      "phone": "",
      "address": "",
      "instagram": "",
      "facebook": "",
      "heroImg": "",
      "age": 0,
      "countDownImg": "",
      "countDownDate": "",
      "distance": 0,
      "longitude": 0,
      "latitude": 0
    }
  }

  return result[0]
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

const updateMapLoactionService = async (payload: IMapLoaction) => {
  const { longitude, latitude, distance } = payload;

  const updateData: Record<string, unknown> = {};

  //if longitude & latitude is available
  if (longitude && latitude) {
    updateData.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    }
  }

  //if distance is available
  if(distance){
    updateData.distance=distance
  }


  const result = await InformationModel.updateOne(
    {},
    updateData,
    { runValidators: true }
  );

  return result;
}


export {
  createInformationService,
  getInformationService,
  updateHeroImgService,
  updateCountDownImgService,
  updateCountDownTimeService,
  updateMapLoactionService
};
