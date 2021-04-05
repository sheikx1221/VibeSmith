export enum ErrorTypes {
    TOKEN_NOT_IN_REQ = "Token not found in request",
    FAILED_TOKEN_FETCH = "Failed to fetch Token for this payment",
    STARTING = "Proceed With Payment",
    AUTHENTICATION_ERROR = "Cannot Authenticate your card, Please check this issue with your bank!",
    PAYMENT_SUCESSFULL = "Continue To Upload Vybes",
    CARD_INVALID = "Invalid Card Details, Please Check your details again!",
    INVALID_EXPIRY_DATE = "Your Card Expiry Date Is Invalid!",
    PAYMENT_FAILED = "Payment Failed, Retry",
    CARD_DECLINED = "Your Card has been declined!, Please contact with your bank on this issue.",
    INSUFFICENT_FUNDS = "Your Account does not have the amount required to be processed.",
    LOST_CARD = "Card has been reported lost. If you have found this card, contact relevant bank or person immediately.",
    STOLEN_CARD = "Card has been reported stolen. Please return this back to the respected bank as soon as possible.",
    EXPIRED_CARD = "Your card has been expired. Please contact your bank and check with this issue.",
    INCORRECT_CVC = "The CVC you entered is incorrect. Please check again.",
    PROCESSING_ERROR = "Unable to process your payment at the moment. Please try again in a while.",
    INCORRECT_NUMBER = "The Card Number you entered is incorrect. Please check your card number again!.",
    "Network request failed" = "Having Issues With Network Connectivity!. Please Check your Internet Connection"

}

export function getErrorTypeFromCode(CodeReceived: any){
    if(!CodeReceived) return "Please Check your credentials again";
    switch(CodeReceived){
        case "AUTHENTICATION_ERROR":
            return ErrorTypes.AUTHENTICATION_ERROR;
        case "PAYMENT_SUCESSFULL":
            return ErrorTypes.PAYMENT_SUCESSFULL;
        case "CARD_INVALID":
            return ErrorTypes.CARD_INVALID;
        case "INVALID_EXPIRY_DATE":
            return ErrorTypes.INVALID_EXPIRY_DATE;
        case "PAYMENT_FAILED":
            return ErrorTypes.PAYMENT_FAILED;
        case "CARD_DECLINED":
            return ErrorTypes.CARD_DECLINED;
        case "INSUFFICENT_FUNDS":
            return ErrorTypes.INSUFFICENT_FUNDS;
        case "LOST_CARD":
            return ErrorTypes.LOST_CARD;
        case "STOLEN_CARD":
            return ErrorTypes.STOLEN_CARD;
        case "EXPIRED_CARD":
            return ErrorTypes.EXPIRED_CARD;
        case "INCORRECT_CVC":
            return ErrorTypes.INCORRECT_CVC;
        case "PROCESSING_ERROR":
            return ErrorTypes.PROCESSING_ERROR;
        case "INCORRECT_NUMBER":
            return ErrorTypes.INCORRECT_NUMBER;
        case "Network request failed": 
            return ErrorTypes['Network request failed'];
        default: 
            return CodeReceived;
    }
}

