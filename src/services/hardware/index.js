// Barrel export for all hardware services.
// Import from here in UI code: `import { PassportReaderService } from "@/services/hardware";`
export { default as PassportReaderService } from "./PassportReaderService";
export { default as RFIDReaderService } from "./RFIDReaderService";
export { default as BarcodeScannerService } from "./BarcodeScannerService";
export { default as DocumentScannerService } from "./DocumentScannerService";
export { default as MicrophoneService } from "./MicrophoneService";
export { default as SpeakerService } from "./SpeakerService";