
import { IInformation, IMapLoaction, INearbyQuery } from './Information.interface';
import InformationModel from './Information.model';
import ApiError from '../../errors/ApiError';
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
    image = await uploadImage(req);
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
    image = await uploadImage(req);
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

const checkNearbyLocationService = async (query: INearbyQuery) => {
  const { longitude, latitude} = query;
  if (!longitude || !latitude) {
    throw new ApiError(400, "Longitude and latitude are required");
  }

  //check longitude
  if(!(longitude >= -180) || !(longitude <= 180)){
    throw new ApiError(400, "longitude must be between -180 and 180");
  }

  //check latitude
  if(!(latitude >= -90) || !(latitude <= 90)){
    throw new ApiError(400, "latitude must be between -90 and 90");
  }

  //check distance
  const information = await InformationModel.findOne();
  if(!information?.distance){
    throw new ApiError(404, "distance not found");
  }

  const radiusInMiles = information.distance || 5; //miles
  const earthRadiusInMiles = 3958.8; // Earth's radius in miles
  
  const result = await InformationModel.aggregate([
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [
              [Number(longitude), Number(latitude)], // [longitude, latitude]
              Number(radiusInMiles) / earthRadiusInMiles, // convert miles to radians
            ],
          },
        },
      },
    }]);

  
  if(result.length ===0){
    throw new ApiError(400, `Sorry, this location is outside our ${radiusInMiles}-miles delivery range`);
  }

  return null;
}


export {
  createInformationService,
  getInformationService,
  updateHeroImgService,
  updateCountDownImgService,
  updateCountDownTimeService,
  updateMapLoactionService,
  checkNearbyLocationService
};
