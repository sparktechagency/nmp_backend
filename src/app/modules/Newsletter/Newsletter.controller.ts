import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { NewsletterValidFields } from './Newsletter.constant';
import { deleteSubsciberService, getSubscribersService, subscribeToNewsletterService } from './Newsletter.service';

const subscribeToNewsletter = catchAsync(async (req, res) => {
  const result = await subscribeToNewsletterService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Subscribed success',
    data: result,
  });
});


const getSubscribers = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, NewsletterValidFields);
  const result = await getSubscribersService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscribers are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});



const deleteSubscriber = catchAsync(async (req, res) => {
  const { subscriberId } = req.params;
  const result = await deleteSubsciberService(subscriberId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscriber is deleted successfully',
    data: result,
  });
});

const NewsletterController = {
  subscribeToNewsletter,
  getSubscribers,
  deleteSubscriber
};
export default NewsletterController;
