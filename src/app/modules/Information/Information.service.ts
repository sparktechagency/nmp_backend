
import { IInformation } from './Information.interface';
import InformationModel from './Information.model';

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

export {
  createInformationService,
  getInformationService
};
