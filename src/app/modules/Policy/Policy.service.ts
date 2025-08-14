import ApiError from "../../errors/ApiError";
import { PolicyTypeArray } from "./Policy.constant";
import { IPolicy, TPolicyType } from "./Policy.interface";
import PolicyModel from "./Policy.model";

const createUpdatePolicyService = async (payload: IPolicy) => {
  //check policy is already exists
  const policy = await PolicyModel.findOne({ type: payload.type });

  if (policy) {
    const result = await PolicyModel.updateOne(
      { type: payload.type },
      { content: payload.content},
      { runValidators: true }
    );
    return result;
  }

  const result = await PolicyModel.create(payload);  return result;
};


const getPolicyByTypeService = async (type: TPolicyType) => {
  //check type is not valid
  if (!PolicyTypeArray.includes(type)) {
    throw new ApiError(
      400,
      `Please provide valid Type-- 'privacy-policy' or 'terms-condition' or 'about-us', 'help' `
    );
  }

  const result = await PolicyModel.findOne({ type }).select("-_id -createdAt -updatedAt");
  if (!result) {
    return {
      type,
      content: ""
    }
  }
  return result;
};


export {
  createUpdatePolicyService,
  getPolicyByTypeService,
};
