import { IImagePreprocessingService, OpenCVImagePreprocessingService } from './preprocessing/ImagePreprocessingService';
import { IOCRService, APIOCRService } from './ocr/OCRService';
import { IValidationService, APIValidationService } from './validation/ValidationService';
import { ITamperingService, APITamperingService } from './tampering/TamperingService';
import { IFaceVerificationService, APIFaceVerificationService } from './face/FaceVerificationService';
import { IRiskService, APIRiskService } from './risk/RiskService';

export class AIServiceFactory {
  public static getPreprocessingService(): IImagePreprocessingService {
    return new OpenCVImagePreprocessingService();
  }

  public static getOCRService(): IOCRService {
    return new APIOCRService();
  }

  public static getValidationService(): IValidationService {
    return new APIValidationService();
  }

  public static getTamperingService(): ITamperingService {
    return new APITamperingService();
  }

  public static getFaceVerificationService(): IFaceVerificationService {
    return new APIFaceVerificationService();
  }

  public static getRiskService(): IRiskService {
    return new APIRiskService();
  }
}
