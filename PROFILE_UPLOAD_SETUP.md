# Profile Photo Upload Setup

This guide explains how to configure the profile photo upload functionality for the TaxiNearMe application.

## Prerequisites

- Cloudinary account (free tier available)
- Environment variables configuration

## Cloudinary Setup

### Step 1: Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. Note your **Cloud Name** from the dashboard

### Step 2: Create Upload Preset
1. Navigate to **Settings** > **Upload** in your Cloudinary dashboard
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `taxinearme_profiles` (or any name you prefer)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `taxi-app/profiles` (optional, for organization)
   - **Use filename**: `No` (let Cloudinary generate unique names)
   - **Unique filename**: `Yes`
5. Save the preset

### Step 3: Configure Environment Variables
1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=taxinearme_profiles
```

Example:
```env
VITE_CLOUDINARY_CLOUD_NAME=democloud123
VITE_CLOUDINARY_UPLOAD_PRESET=taxinearme_profiles
```

## Features

### Profile Photo Upload Component
- **Drag & Drop**: Users can drag images directly onto the upload area
- **Click to Upload**: Traditional file selection via click
- **Image Preview**: Immediate preview of selected images
- **Validation**: Automatic file type and size validation
- **Error Handling**: Clear error messages for invalid uploads
- **Loading States**: Visual feedback during upload process

### Supported Formats
- **File Types**: JPG, JPEG, PNG
- **Maximum Size**: 2MB per image
- **Automatic Optimization**: Cloudinary handles image optimization

### Integration Points
1. **User Registration**: Optional profile photo during signup
2. **Profile Editing**: Update profile photo in edit profile page
3. **Header Display**: Profile photos appear in navigation header
4. **Profile Page**: Profile photos displayed in user dashboard

## Troubleshooting

### Common Issues

1. **"Cloudinary is not configured" Error**
   - Check that environment variables are set correctly
   - Ensure `.env` file is in project root
   - Restart development server after changing environment variables

2. **Upload Fails Silently**
   - Check browser console for detailed error messages
   - Verify upload preset is set to "Unsigned"
   - Ensure CORS is properly configured in Cloudinary

3. **Images Not Displaying**
   - Check that URLs are being saved correctly in the database
   - Verify image URLs are accessible (not private)
   - Check browser network tab for failed image requests

### Development Tips

1. **Testing Without Cloudinary**
   - The component will show appropriate error messages
   - Users can still use the app without profile photos
   - Consider using placeholder images during development

2. **Environment Variables**
   - Never commit actual credentials to version control
   - Use different presets for development and production
   - Consider using separate Cloudinary accounts for different environments

## Security Considerations

- Upload presets are unsigned for ease of use
- Consider implementing server-side validation for production
- Monitor upload usage to stay within Cloudinary limits
- Implement rate limiting if needed

## Production Deployment

When deploying to production:

1. Create production Cloudinary account/preset
2. Update environment variables in deployment platform
3. Test upload functionality in production environment
4. Monitor usage and performance
