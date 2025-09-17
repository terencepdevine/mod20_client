# Form Submission Protection Pattern

This hook prevents the "flash" of old data that occurs when forms reset during save operations.

## The Problem

When saving a form:
1. User clicks "Save" 
2. Form submits new data
3. Server processes the update
4. React re-renders with server data
5. **FLASH**: Form briefly shows old data before showing new data
6. Form eventually shows the correct updated data

## The Solution

The `useFormSubmissionProtection` hook prevents form resets during the submission cycle, keeping user input visible until the save completes.

## ✅ Simple Usage Pattern

```typescript
import { useFormSubmissionProtection } from "../../hooks/useFormSubmissionProtection";

// In your form component:
const { createProtectedSubmitHandler } = useFormSubmissionProtection(
  entityData,           // Current server data
  isUpdating,          // Whether save is in progress  
  optimisticData,      // Any optimistic update data
  reset,               // react-hook-form reset function
  createFormData       // Function: (entity) => formData
);

// Replace your submit handler
const handleFormSubmit = createProtectedSubmitHandler(onSubmit);
```

## 📋 Real Examples

### AdminSystemForm (Current Implementation)
```typescript
const { createProtectedSubmitHandler } = useFormSubmissionProtection(
  system,
  isUpdating,
  optimisticData,
  reset,
  (sys) => createSystemFormData(sys, formatAbilitiesForForm, formatSkillsForForm)
);

const handleFormSubmit: SubmitHandler<SystemFormData> = createProtectedSubmitHandler(onSubmit);
```

### AdminRoleForm (Easy to implement)
```typescript
const { createProtectedSubmitHandler } = useFormSubmissionProtection(
  role,
  isUpdating,
  optimisticData,
  reset,
  (roleData) => createRoleFormData(roleData)
);

const handleFormSubmit: SubmitHandler<RoleFormData> = createProtectedSubmitHandler(onSubmit);
```

### AdminRaceForm (Easy to implement)
```typescript
const { createProtectedSubmitHandler } = useFormSubmissionProtection(
  race,
  isUpdating,
  optimisticData,
  reset,
  (raceData) => createRaceFormData(raceData)
);

const handleFormSubmit: SubmitHandler<RaceFormData> = createProtectedSubmitHandler(onSubmit);
```

## 🎯 Key Benefits

1. **5-Line Implementation**: Just import, add hook, replace submit handler
2. **No Complex Logic**: No field comparisons or state tracking needed
3. **Type Safe**: Fully typed with TypeScript generics
4. **Universal**: Works with any admin form structure
5. **Performance**: Minimal overhead, automatic cleanup

## 🚀 Implementation Steps

1. **Import the hook**:
   ```typescript
   import { useFormSubmissionProtection } from "../../hooks/useFormSubmissionProtection";
   ```

2. **Add the hook** (replace existing form initialization logic):
   ```typescript
   const { createProtectedSubmitHandler } = useFormSubmissionProtection(
     entityData,
     isUpdating,
     optimisticData,
     reset,
     createFormDataFunction
   );
   ```

3. **Replace submit handler**:
   ```typescript
   // Before:
   const handleFormSubmit = (data) => onSubmit(data);
   
   // After:
   const handleFormSubmit = createProtectedSubmitHandler(onSubmit);
   ```

4. **Remove old form reset logic** (if any manual useEffect form resets exist)

## ✅ Testing Checklist

- [ ] Fields remain editable during normal use
- [ ] No flash when clicking "Save Changes"  
- [ ] Form resets properly on initial page load
- [ ] Form updates correctly after successful save
- [ ] No console errors or warnings

## 🎯 When to Use

Use this on **every admin form** to prevent field flashing. It's safe to implement even if flashing isn't currently visible - it prevents future issues and improves user experience.