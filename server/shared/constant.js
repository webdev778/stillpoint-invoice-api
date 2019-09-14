const _1MB = 1000000;

module.exports = {
  OOPS_ERROR: "Oops!!! Something went wrong",
  REQUEST_OK: "The request is OK",
  AUTH_FAIL: "Authentication failed",
  INVALID_FORMAT: "Invalid format",
  INVALID_PARAMETER: "Invalid parameters",
  SUCCESS_UPDATE_PROFILE: "You have successfully updated your profile",
  INVALID_STATE_ID: "Invalid State Id",
  DATE_ERROR: "Either start date is greater than end date or end date is greater than current date",
  INVALID_LINKEDIN_LINK: 'Please enter a valid LinkedIn link',
  INVALID_AMT: "Either minimum or maximum amount is not valid",
  INVALID_EMP_ID: "Invalid employment type id",
  UPLOAD_ERROR: "Unable to upload",
  INVALID_FILE_FORMAT: "Unsupported file format",
  FILE_SIZE_ERROR: "File size exceeds the limit",
  INVALID_CREDENTIALS: 'Invalid User Credentials',
  INVALID_PASS_FORMAT: "Password format is not correct",
  INVALID_EMAIL_FORMAT: "Email format is not correct",
  ENTER_EMAIL: "Please enter your email address",
  ENTER_PASSWORD: "Please enter your password",
  MISMATCH_PASS_CONFPASS: "Password does not match the confirm password",
  INVALID_EMAIL_ADD: "Please enter a valid email address",
  EMAIL_DOESNOT_EXIST: "That email address does not exist in our system",
  EXPIRED_LINK: "The link has been expired",
  INVALID_LINK: "Invalid link or link has been expired",
  SUCCESS_RESET_PASS: "You have successfully reset your password",
  SENT_RESET_EMAIL: "We have send you Reset password link on your email",
  CURRPASS_DOESNOT_EXIST: 'Your current password does not match our records',
  SENT_CONTACTUS_MAIL: "The Legably team sent you a message",
  ENTER_CURR_PASS: 'Please enter your current password',
  ENTER_NEW_PASS: 'Please enter your new password',
  ENTER_RETYPE_PASS: 'Please enter your retype new password',
  PASS_NOT_MATCH: 'Passwords do not match',
  INVALID_PASS_LENGTH: 'A valid password must be at least 8 characters long',
  INVALID_BAR_LENGTH: 'Bar registration number cannot be more than 15 digits',
  INVALID_SINGLE_CHAR_PASS: 'The password can not consist of single characters, i.e. "11111111" or "aaaaaaaa"',
  INVALID_CONSECUTIVE_PASS: 'The password can not consist of consecutive characters, i.e. "12345678" or "abcdefgh"',
  ENTER_FIRST_NAME: 'Please enter your first name',
  ENTER_LAST_NAME: 'Please enter your last name',
  ENTER_SUBJECT: 'Please enter your subject',
  ENTER_MESSAGE: 'Please enter your message',
  INVALID_FIRST_NAME_FORMAT: 'First Name should contain only alphabetic characters',
  INVALID_FIRST_NAME_LENGTH: 'First Name must be less than 50 characters',
  INVALID_LAST_NAME_FORMAT: 'Last Name should contain only alphabetic characters',
  INVALID_LAST_NAME_LENGTH: 'Last Name must be less than 50 characters',
  INVALID_SUB_LENGTH: 'Subject must be less than 50 characters',
  INVALID_MESSAGE_LENGTH: 'Message must be 1000 characters or less',
  CHECKBOX_ERROR: 'Please click the checkbox to verify',
  ENTER_RETYPE_PASSWORD: 'Please enter your retype password',
  TERM_SERV_ERROR: "Please click here to accept Legably's Terms of Service",
  FILE_COUNT_ERROR: "You can upload only one file",
  INVALID_LAWYER_HEADLINE_LENGTH: 'My Headline must be less than 150 characters',
  INVALID_ABOUT_ME_LENGTH: 'About Me must be less than 700 characters',
  ENTER_PRACTICE_AREA: 'Please enter your practice area',
  ENTER_STREET_ADD: 'Please enter your street address',
  INVALID_CITY_NAME: 'Please enter valid city name',
  ENTER_CITY: 'Please enter your city',
  ENTER_STATE: 'Please enter your state',
  ENTER_ZIPCODE: 'Please enter zip code',
  INVALID_PHONE_NO: 'Please enter valid mobile number',
  ENTER_PHONE_NO: 'Please enter your mobile number',
  ENTER_SCHOOL: 'Please enter your school',
  ENTER_DEGREE: 'Please enter your degree',
  ENTER_YEAR: 'Please enter your graduated year',
  ENTER_BAR_SKILL: 'Please enter skills',
  INVALID_ADD_INFO_LENGTH: 'Additional Information must be less than 250 characters',
  ENTER_BAR_NO: 'Please enter your bar registration number',
  ONLY_NUMERIC_ERROR: "Please enter numeric values only",
  INVALID_ZIPCODE: 'Zip Code should be numeric only and cannot exceed 5 digits',
  INVALID_YEAR: "Please enter a valid year",
  INVALID_YEAR_RANGE: "Year should be in range 1920 to current year",
  INVALID_COMPANY_NAME_LENGTH: 'Company name must be less than 100 characters',
  GREATER_START_DATE_ERROR: 'Start date is greater than end Date',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_FIRSTNAME: 'Please enter a valid First Name',
  INVALID_LASTNAME: 'Please enter a valid Last Name',
  INVALID_URL: 'Please enter a valid website url',
  INVALID_ESTIMATED_DATE: "Estimated start date should be greater than or equal to today's date",
  INVALID_HOUR_TYPE_ID: 'Invalid hour type id',
  SUBTOTAL_ERROR: "Sub total amount calculation is not correct",
  TOTAL_AMT_ERROR: "Total amount calculation is not correct",
  SUCCESS_POST_JOB: "You have successfully posted a job",
  NO_RECORD_FOUND: "No record found",
  INVALID_DUE_DATE: "Due date should be greater than or equal to today's date",
  IMAGE_SIZE_ERROR: "Image size should not exceed 10MB",
  RESUME_SIZE_ERROR: "File size should not exceed 3MB",
  ENTER_LOCATION: "Please select state",
  POPUP_MSG: 'The information you have entered on this page may not have been saved. Are you sure you want to leave?',
  IE_MSG: "For the best experience, please use Legably in Google Chrome or Mozilla Firefox or Safari.",
  NEGATIVE_VAL_ERROR: "Please enter value greater than zero",
  EMAIL_PASS_ERROR: "Email and/or Password can't be blank",
  SAVED_ERROR: "You have already saved the job",
  UNSAVED_ERROR: "You have already unsaved the job",
  APPLIED_ERROR: "You have already Applied the job",
  INPROGRESS_ERROR: "Job is already in progress",
  NO_RESOURCE_FOUND: "No resource found",
  INACTIVE_STATUS: "We’re sorry but we could not log you into the system. Please contact support for further assistance.",
  INVALID_BAR_ID: "We’re sorry but we are having difficulty verifying your Bar certifications. Please contact support for further assistance.",
  MIN_JOB_AMOUNT: "Amount Payable cannot be less than $100.00",
  MILESTONE_DUE_DATE_ORDER: "Deliverables due date should be in sequential order",
  MILESTONE_DUE_DATE_ERROR: "Deliverables must have a due date and not be less than the current date",
  ACTION_DENIED: "You cannot perform this action",
  EMPTY_FIELD_ERROR: "Required fields cannot be left blank",

  'ROLE': {
    'POSTER': 'poster',
    'SEEKER': 'seeker'
  },

  'RES_OBJ': {
    'STATUS': {
      'SUCCESS': true,
      'FAIL': false
    },
    'CODE': {
      'SUCCESS': 200,
      'IM_USED': 226,
      'FAIL': 400,
      'UNAUTHORIZED': 401,
      'NOT_FOUND': 404,
      'NOT_ACCEPTABLE': 406,
      'CONFLICT': 409,
      'INVALID_BAR_ID': 417,
      'UNPROCESSABLE': 422,
      'LOCKED': 423,
      'FAILED_DEPENDENCY': 424,
      'PRECONDITION_REQUIRED': 428
    },
    'MSG': {
      'SUCCESS': 'The request is OK',
      'IM_USED': 'IM Used',
      'FAIL': 'Oops!!! Something went wrong',
      'UNAUTHORIZED': 'Invalid User Credentials',
      'NOT_FOUND': 'Requested resource not found',
      'NOT_ACCEPTABLE': 'Not Acceptable',
      'CONFLICT': 'Conflict',
      'INVALID_BAR_ID': 'Expectation Failed',
      'UNPROCESSABLE': 'Unprocessable Entity',
      'LOCKED': 'Locked',
      'FAILED_DEPENDENCY': 'Failed dependency',
      'PRECONDITION_REQUIRED': 'Precondition Required'
    }
  },
  'STATUS': {
    'ACTIVE': 1,
    'INACTIVE': 0,
    'SOFT_DELETED': -1,
    'DELETED': -2
  },
  'JOB_STEPS': {
    'APPLY': 100,
    'APPLIED': 101,
    'INTERVIEWING': 102,
    'N_TERMS': 103,
    'S_PENDING': 104,
    'IN_PROGRESS': 105,
    'J_COMPLETE': 106
  },
  'N_TERMS_STATUS': {
    'NOT_SENT': 0,
    'SENT': 1,
    'ACCEPTED': 2,
    'DECLINED_BY_POSTER_BEFORE_SENT': -10,
    'DECLINED_BY_POSTER_AFTER_SENT': -11,
    'DECLINED_BY_SEEKER_BEFORE_ACCEPTED': -20,
    'DECLINED_BY_SEEKER_AFTER_ACCEPTED': -21
  },
  'MAIL_OBJ': {
    'SUBJECT_FRAGMENT': 'Legably Message Center',
    'SUPPORT_ID': 'support@legably.com',
    'MAIL_TYPE': {
      'CONTACT_US_FOR_SUPPORT': 1,
      'CONTACT_US_FOR_USER': 2,
      'EMAIL_VERIFICATION': 3,
      'FORGOT_PASSWORD': 4,
      'SEND_MESSAGE': 5,
      'JOB_POSTED': 6,
      'JOB_APPLIED': 7,
      'JOB_TERMS_ACCEPTED_FOR_POSTER': 8,
      'JOB_TERMS_ACCEPTED_FOR_SEEKER': 9,
      'PAYMENT_TRANSFERED_IN_ESCROW_FOR_POSTER': 10,
      'PAYMENT_TRANSFERED_IN_ESCROW_FOR_SEEKER': 11,
      'MILESTONE_UPLOADED': 12,
      'MILESTONE_REJECTED': 13,
      'MILESTONE_APPROVED': 14,
      'PAYMENT_RELEASED_FROM_ESCROW_FOR_POSTER': 15,
      'PAYMENT_RELEASED_FROM_ESCROW_FOR_SEEKER': 16,
      'JOB_COMPLETED': 17,
      'CANDIDATE_COMPLETED': 18,
    }
  },
  'DELIVERABLE_STATUS': {
    'PENDING': 0,
    'SUBMITTED': 1,
    'APPROVED': 2,
    'RELEASED': 3,
    'PAID': 4,
    'DECLINED': -1
  },
  'STRIPE_ACCOUNT_STATUS': {
    'NOT_CREATED': 0,
    'CREATED': 1,
    'ACTIVATED': 2
  },
  'PAYMENT_STATUS': {
    'FUND_TRANSFER_REQUEST_NOT_SENT': 0,
    'FUND_TRANSFER_REQUEST_SENT': 1,
    'FUND_TRANSFER_SUCCESSFUL': 2,
    'CANCELLED': -1
  },
  'STRIPE_EVENT_TYPE': {
    'ACCOUNT_APPLICATION_AUTHORIZED': 'account.application.authorized',
    'TRANSFER_FUND_PAID': 'payment.created',
    'RELEASE_PAYMENT_PAID': 'transfer.created',
  },
  'MAX_UPLOAD_FILE_SIZE': 5 * _1MB,
  'MAX_UPLOAD_RESUME_SIZE': 3 * _1MB,
  'MAX_UPLOAD_PHOTO_SIZE': 10 * _1MB,
  'FETCH_DATA_MAX_LIMIT': 999999,
  'DATE_FORMAT': 'MM/DD/YYYY',
  'PASSWORD_SYMBOL': '********',
  'CENT_TO_DOLLAR': 100,

  // invoice type
  INVOICE_INDIVIDUAL: 0,
  INVOICE_RECURRING: 1,

  // invoice status
  INVOICE_DRAFT: 0,
  INVOICE_SENT: 1,
  INVOICE_PAID: 2,

  // stripe one-time checkout transaction status
  STRIPE_PAYMENT:{
    TRANS_INIT: 0,
    TRANS_COMPLETE: 1
  }
}
