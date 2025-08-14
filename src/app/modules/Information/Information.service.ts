
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
      "email": "",
      "phone": "",
      "address": "",
      "instagram": "",
      "telegram": ""
    }
  }
  return result;
};

export {
  createInformationService,
  getInformationService
};
