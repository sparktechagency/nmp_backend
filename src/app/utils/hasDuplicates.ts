import { Types } from "mongoose";

function hasDuplicates(arr: Types.ObjectId[]) {
  return new Set(arr).size !== arr.length;
}

export default hasDuplicates;