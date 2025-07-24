# Generic Media Library System

A fully generic, reusable media library system that can be used with any entity type (roles, systems, races, etc.) in the application.

## Architecture

### Core Components

1. **`MediaLibraryProvider`** - Context provider that manages all media library state and logic
2. **`MediaLibraryImageField`** - Individual image field components that can be placed anywhere in your JSX
3. **`useMediaLibraryContext`** - Hook to access media library functionality

### Features

- ✅ **Fully Generic** - Works with any entity type
- ✅ **Optimistic Updates** - No flashing when adding/removing images
- ✅ **Flexible Placement** - Place image fields anywhere in your JSX
- ✅ **Configurable Fields** - Define any image field configuration
- ✅ **Upload Integration** - Built-in upload functionality in modal
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Reusable** - Easy to add new entity types

## Usage Examples

### Role Usage (AdminRole.tsx)

```typescript
import { MediaLibraryProvider, MediaLibraryImageField, ImageFieldConfig } from "../../components/MediaLibrary";

// Define your fields
const roleImageFields = [
  {
    type: "background",
    label: "Background Image", 
    description: "Single background image for this role",
    isMultiple: false,
    maxCount: 1,
    fieldKey: "backgroundImageId",
  },
  {
    type: "gallery",
    label: "Featured Images",
    description: "Multiple images that represent this role", 
    isMultiple: true,
    maxCount: 9,
    fieldKey: "imageIds",
  }
];

// Define your update function
const updateRoleField = async (fieldKey: string, value: any) => {
  const updateData = { [fieldKey]: value };
  return await updateRole(systemSlug!, sectionSlug!, updateData);
};

// Use Provider + place image fields anywhere in your JSX
<MediaLibraryProvider
  entityType="role"
  entityData={role}
  queryKey={["role", systemSlug, sectionSlug]}
  updateEntity={updateRoleField}
  isUpdating={isUpdatingRole}
>
  <div className="content">
    <div className="content__main">
      <h1>Edit Role</h1>
      <Input {...} />
      
      {/* Background Image - place it anywhere! */}
      <MediaLibraryImageField
        type="background"
        label="Background Image"
        description="Single background image for this role"
        isMultiple={false}
        maxCount={1}
        fieldKey="backgroundImageId"
      />
    </div>
    <aside className="content__sidebar">
      <Button>Save</Button>
      
      {/* Featured Images - place it anywhere! */}
      <MediaLibraryImageField
        type="gallery"
        label="Featured Images"
        description="Multiple images that represent this role"
        isMultiple={true}
        maxCount={9}
        fieldKey="images"
      />
    </aside>
  </div>
</MediaLibraryProvider>
```

### System Usage Example

```typescript
// Define system fields
const systemImageFields = [
  {
    type: "hero",
    label: "Hero Image",
    description: "Main hero image for the system",
    isMultiple: false,
    maxCount: 1,
    fieldKey: "heroImageId",
  },
  {
    type: "gallery",
    label: "System Gallery", 
    description: "Gallery images showcasing the system",
    isMultiple: true,
    maxCount: 12,
    fieldKey: "galleryImageIds",
  }
];

// Define update function
const updateSystemField = async (fieldKey: string, value: any) => {
  const updateData = { [fieldKey]: value };
  return await updateSystem(systemSlug, updateData);
};

// Use anywhere in your component
<MediaLibraryProvider
  entityType="system"
  entityData={system}
  queryKey={["system", systemSlug]}
  updateEntity={updateSystemField}
  isUpdating={isUpdatingSystem}
>
  <div className="system-form">
    <MediaLibraryImageField config={systemImageFields[0]} />
    <MediaLibraryImageField config={systemImageFields[1]} />
  </div>
</MediaLibraryProvider>
```

## Adding New Entity Types

Adding a new entity type is simple:

1. **Define your fields** in your admin component:

```typescript
const characterImageFields = [
  {
    type: "avatar",
    label: "Character Avatar",
    description: "Main avatar image",
    isMultiple: false,
    maxCount: 1,  
    fieldKey: "avatarImageId",
  },
  {
    type: "gallery",
    label: "Character Gallery",
    description: "Multiple character images",
    isMultiple: true,
    maxCount: 8,
    fieldKey: "characterImageIds",
  }
];
```

2. **Define your update function**:

```typescript
const updateCharacterField = async (fieldKey: string, value: any) => {
  const updateData = { [fieldKey]: value };
  return await updateCharacter(characterId, updateData);
};
```

3. **Use MediaLibraryProvider + MediaLibraryImageField**:

```typescript
<MediaLibraryProvider
  entityType="character"  
  entityData={character}
  queryKey={["character", characterId]}
  updateEntity={updateCharacterField}
  isUpdating={isUpdatingCharacter}
>
  <div className="character-form">
    <MediaLibraryImageField config={characterImageFields[0]} />
    <MediaLibraryImageField config={characterImageFields[1]} />
  </div>
</MediaLibraryProvider>
```

**That's it!** Place the image fields anywhere in your JSX structure.

## Field Configuration

Each image field is configured with:

- **`type`** - Unique identifier for the field
- **`label`** - Display name shown to users
- **`description`** - Help text shown to users
- **`isMultiple`** - Whether field accepts multiple images
- **`maxCount`** - Maximum number of images (optional)
- **`fieldKey`** - The actual field name in your entity data

## Benefits

1. **Maximum Flexibility** - Place image fields anywhere in your component tree
2. **DRY Principle** - No code duplication across entity types
3. **Consistent UX** - Same media library experience everywhere
4. **Easy Maintenance** - Changes in one place affect all entities
5. **Type Safety** - Full TypeScript support prevents errors
6. **Performance** - Optimistic updates and smart caching
7. **Clean Architecture** - Provider pattern with individual components

## File Structure

```
src/components/MediaLibrary/
├── index.ts                     # Main exports
├── types.ts                     # TypeScript interfaces
├── MediaLibraryContext.tsx      # Context definition & hook
├── MediaLibraryProvider.tsx     # Provider component
├── MediaLibraryImageField.tsx   # Individual image field component
└── README.md                    # Documentation
```

Just 5 focused files handle all entity types with maximum flexibility!

## Migration from Old System

If you had any old MediaLibraryManager usage, simply:

1. Replace `MediaLibraryManager` with `MediaLibraryProvider`
2. Place `MediaLibraryImageField` components exactly where you want them in your JSX
3. Remove any layout props or children functions

The new system is simpler and more flexible!