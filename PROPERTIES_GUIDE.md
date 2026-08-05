# Properties Management Guide

This guide explains how to manage properties for the ATHARRYS PROPERTIES website.

## Overview

The website uses a JSON-based property management system that makes it easy to add, edit, or remove properties without touching the HTML code. This is perfect for a startup organization that currently has 2 properties but plans to add more in the future.

## File Structure

```
realestate/
├── data/
│   └── properties.json    # All property data is stored here
├── images/
│   ├── build1.jpeg        # Property images
│   ├── build2.jpeg
│   └── ...
├── properties.html        # Properties listing page
├── property-detail.html   # Individual property page
└── js/
    ├── properties.js      # Handles property listing
    └── property-detail.js # Handles property details
```

## Adding a New Property

### Step 1: Prepare Your Images

1. Take high-quality photos of the property
2. Resize images to approximately 1200x800 pixels for optimal web display
3. Save images in the `images/` folder with descriptive names (e.g., `property-lekki-villa-1.jpeg`)
4. Recommended: Use JPEG format for photos

### Step 2: Edit the Properties JSON File

Open `data/properties.json` and add a new property object to the `properties` array:

```json
{
  "id": 3,
  "title": "Your Property Title",
  "slug": "your-property-title",
  "type": "residential",
  "status": "sale",
  "location": "lagos",
  "address": "Full Address, City",
  "bedrooms": 4,
  "bathrooms": 3,
  "size": 350,
  "price": 85000000,
  "priceDisplay": "₦85,000,000",
  "features": ["parking", "pool", "garden", "security"],
  "amenities": ["Swimming Pool", "Garden", "24/7 Security", "Parking Space"],
  "image": "images/your-main-image.jpeg",
  "images": [
    "images/your-image-1.jpeg",
    "images/your-image-2.jpeg",
    "images/your-image-3.jpeg"
  ],
  "description": "A detailed description of the property...",
  "highlights": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "yearBuilt": 2023,
  "parkingSpaces": 2,
  "featured": false,
  "createdAt": "2024-03-01"
}
```

### Property Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Unique identifier (must be unique) |
| `title` | string | Yes | Property title/name |
| `slug` | string | Yes | URL-friendly version of title |
| `type` | string | Yes | `residential`, `commercial`, or `land` |
| `status` | string | Yes | `sale` or `rent` |
| `location` | string | Yes | `lagos`, `abuja`, `portharcourt`, or `ibadan` |
| `address` | string | Yes | Full property address |
| `bedrooms` | number | No | Number of bedrooms (0 for commercial/land) |
| `bathrooms` | number | No | Number of bathrooms |
| `size` | number | Yes | Size in square meters |
| `price` | number | Yes | Price in Naira (numeric only) |
| `priceDisplay` | string | Yes | Formatted price for display |
| `features` | array | Yes | List of feature keywords for filtering |
| `amenities` | array | Yes | List of amenity names for display |
| `image` | string | Yes | Main property image path |
| `images` | array | Yes | Array of all property images |
| `description` | string | Yes | Full property description |
| `highlights` | array | Yes | Key selling points |
| `yearBuilt` | number | No | Year the property was built |
| `parkingSpaces` | number | No | Number of parking spaces |
| `featured` | boolean | Yes | Whether to show as featured |
| `createdAt` | string | Yes | Date added (YYYY-MM-DD) |

### Available Feature Keywords

Use these keywords in the `features` array for proper filtering:

- `parking` - Parking available
- `pool` - Swimming pool
- `garden` - Garden/landscaping
- `security` - 24/7 Security
- `gym` - Gym/fitness center
- `elevator` - Elevator access

### Available Locations

- `lagos` - Lagos
- `abuja` - Abuja
- `portharcourt` - Port Harcourt
- `ibadan` - Ibadan

## Example: Adding a Third Property

```json
{
  "id": 3,
  "title": "Cozy 2-Bedroom Apartment in Ikeja",
  "slug": "cozy-apartment-ikeja",
  "type": "residential",
  "status": "rent",
  "location": "lagos",
  "address": "GRA, Ikeja, Lagos",
  "bedrooms": 2,
  "bathrooms": 2,
  "size": 120,
  "price": 1500000,
  "priceDisplay": "₦1,500,000/year",
  "features": ["parking", "security"],
  "amenities": ["Parking Space", "24/7 Security", "Backup Power"],
  "image": "images/build3.jpeg",
  "images": [
    "images/build3.jpeg",
    "images/build4.jpeg"
  ],
  "description": "A cozy 2-bedroom apartment located in the serene GRA area of Ikeja. Perfect for young professionals or small families, this apartment offers comfortable living with modern amenities.",
  "highlights": [
    "2 spacious bedrooms with fitted wardrobes",
    "Modern kitchen with gas cooker",
    "Secure compound with parking",
    "Close to Ikeja City Mall"
  ],
  "yearBuilt": 2020,
  "parkingSpaces": 1,
  "featured": false,
  "createdAt": "2024-03-15"
}
```

## Editing an Existing Property

1. Open `data/properties.json`
2. Find the property by its `id`
3. Make your changes
4. Save the file
5. Refresh the website

## Removing a Property

1. Open `data/properties.json`
2. Find and delete the entire property object (including the comma)
3. Save the file
4. Refresh the website

**Important**: Make sure the JSON remains valid after deletion. The `properties` array should look like:
```json
{
  "properties": [
    { ... property 1 ... },
    { ... property 2 ... }
  ],
  "metadata": { ... }
}
```

## Tips for Best Results

1. **High-Quality Images**: Use professional photos whenever possible
2. **Detailed Descriptions**: Write compelling descriptions that highlight the property's best features
3. **Accurate Pricing**: Ensure prices are current and accurate
4. **Regular Updates**: Update property status when sold or rented
5. **Featured Properties**: Mark your best properties as `featured: true` to highlight them

## Future Enhancements

When your organization grows, you may want to consider:

1. **Admin Dashboard**: A password-protected page to manage properties through a form interface
2. **Backend Integration**: Connect to a database for more robust data management
3. **Image Upload**: Allow image uploads directly through the admin interface
4. **User Accounts**: Let agents manage their own property listings

## Troubleshooting

### Properties not showing up?
- Check that the JSON file is valid (use a JSON validator)
- Ensure all required fields are present
- Check the browser console for JavaScript errors

### Images not loading?
- Verify image paths are correct
- Ensure images exist in the `images/` folder
- Check image file extensions match (case-sensitive on some servers)

### Filtering not working?
- Ensure feature keywords match the available options
- Check that location values match the expected values

## Support

For technical assistance, contact your web developer or refer to the project documentation.
