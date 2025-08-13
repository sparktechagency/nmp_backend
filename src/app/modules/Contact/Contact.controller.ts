import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { ContactValidFields } from './Contact.constant';
import { createContactService, getAllContactsService, deleteContactService, replyContactService } from './Contact.service';

const createContact = catchAsync(async (req, res) => {
  const result = await createContactService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Contact is created successfully',
    data: result,
  });
});


const getAllContacts = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, ContactValidFields);
  const result = await getAllContactsService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const replyContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const { replyText } = req.body;
  const result = await replyContactService(contactId, replyText);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reply sent successfully.',
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const result = await deleteContactService(contactId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact is deleted successfully',
    data: result,
  });
});

const ContactController = {
  createContact,
  getAllContacts,
  replyContact,
  deleteContact,
};
export default ContactController;
