import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { NearbyValidFields } from './Information.constant';
import { checkNearbyLocationService, createInformationService, getInformationService, updateCountDownImgService, updateCountDownTimeService, updateHeroImgService, updateMapLoactionService } from './Information.service';

const createInformation = catchAsync(async (req, res) => {
  const result = await createInformationService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Information is updated successfully',
    data: result,
  });
});


const getInformation = catchAsync(async (req, res) => {
  const result = await getInformationService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Information is retrieved successfully',
    data: result,
  });
});


const updateHeroImg = catchAsync(async (req, res) => {
  const result = await updateHeroImgService(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Image is updated successfully`,
    data: result,
  });
});

const updateCountDownImg = catchAsync(async (req, res) => {
  const result = await updateCountDownImgService(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Image is updated successfully`,
    data: result,
  });
});

const updateCountDownTime = catchAsync(async (req, res) => {
  const result = await updateCountDownTimeService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Count Down Time is updated successfully`,
    data: result,
  });
});

const updateMapLocation = catchAsync(async (req, res) => {
  const result = await updateMapLoactionService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Map location is updated successfully`,
    data: result,
  });
});


const checkNearbyLocation = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, NearbyValidFields);
  const result = await checkNearbyLocationService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Location is checked successfully',
    data: result,
  });
});


const InformationController = {
  createInformation,
  getInformation,
  updateHeroImg,
  updateCountDownImg,
  updateCountDownTime,
  updateMapLocation,
  checkNearbyLocation
};
export default InformationController;
