# QR Code Management System

This system allows administrators to manage payment QR codes that are displayed to all users during the payment process.

## Features

### Admin Panel

- Upload new QR code images to Cloudinary
- Update bank name and UPI ID
- View current QR code information
- See when the QR code was last updated
- Initialize QR code document if it doesn't exist

### User Payment Page

- Automatically fetches the latest QR code from Firestore
- Displays QR code image, bank name, and UPI ID
- Shows when the QR code was last updated
- Fallback display if QR code is not available

## Setup Instructions

### 1. Cloudinary Configuration

Make sure you have the following environment variables set in your `.env` file:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 2. Cloudinary Upload Preset Setup

1. Go to your Cloudinary dashboard
2. Navigate to Settings > Upload
3. Create an unsigned upload preset named `taxinearme` (or update the preset name in the code)
4. Set the folder to `taxi-app/qr-codes`
5. Configure any transformation settings if needed

### 3. Firestore Collection Structure

The system uses the following Firestore structure:

```
collection: "payment"
document: "qrcodeURLid"
fields:
  - bankName (string): Name of the bank
  - upiId (string): UPI ID for payments
  - qrCodeUrl (string): Cloudinary URL of the QR code image
  - lastUpdated (timestamp): When the QR code was last updated
```

### 4. Initialization

1. Go to Admin Panel > QR Code Management
2. If no QR code exists, click "Initialize QR Code" to create the document with default values
3. Update the QR code with your actual payment information

## Usage

### For Administrators

1. Login to admin panel
2. Navigate to "QR Code Management"
3. Upload a new QR code image
4. Update bank name and UPI ID
5. Click "Update QR Code"

### For Users

- When users reach the payment page, they will automatically see the latest QR code
- The QR code will display the bank name, UPI ID, and last updated date
- If no QR code is configured, users will see a message to contact admin

## File Structure

```
src/
├── admin/
│   ├── pages/
│   │   └── QRCodeManagement.tsx       # Admin QR code management UI
│   ├── services/
│   │   └── qrCodeService.ts           # Admin QR code operations
│   └── setup/
│       └── setupQRCode.ts             # QR code document initialization
├── pages/
│   └── PaymentPage.tsx                # User payment page with QR code display
├── services/
│   └── paymentService.ts              # User-facing QR code fetching
└── utils/
    └── initializeQRCode.ts            # QR code document initialization utilities
```

## API Functions

### Admin Functions

- `getQRCodeData()`: Fetch current QR code data
- `updateQRCodeData(data)`: Update QR code information
- `uploadImageToCloudinary(file)`: Upload image to Cloudinary

### User Functions

- `getPaymentQRCode()`: Fetch QR code for payment page

## Error Handling

The system includes comprehensive error handling for:

- Missing Cloudinary configuration
- Failed image uploads
- Firestore connection issues
- Missing QR code documents
- Invalid file types/sizes

## Security Notes

- Upload preset should be configured properly in Cloudinary
- File size is limited to 5MB
- Only image files are accepted
- Firestore security rules should be configured appropriately
