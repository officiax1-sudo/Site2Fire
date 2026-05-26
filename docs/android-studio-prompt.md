# Prompt for Gemini in Android Studio

Copy and paste the following prompt into Gemini inside Android Studio (or your preferred AI assistant) to start building the native Android TV wrapper for your Site2Fire projects.

---

## The Prompt

"I am building an Android TV application (optimized for Fire TV) that acts as a web wrapper for a specific URL. I have a Next.js 'Site2Fire' dashboard that stores configuration in Firebase Firestore at the path: `/users/{userId}/builds/{buildId}`.

The Firestore document (entity: 'Build') contains:
- `webUrl`: The target website to load.
- `dpadScript`: A custom JavaScript snippet for D-Pad optimization.
- `orientation`: 'landscape' or 'portrait'.
- `permissions`: A list of required Android permissions.

**Task:**
Please help me write the Kotlin code for a functional Android TV app that:
1. **Initializes Firebase:** Connects to my Firestore database to fetch the latest 'Build' configuration for a specific user.
2. **Implements a WebView:** Sets up a full-screen `WebView` with JavaScript enabled.
3. **Injects JavaScript:** Automatically injects the `dpadScript` into the WebView once the page has finished loading to enhance remote control navigation.
4. **Handles Focus:** Ensures the WebView handles D-Pad (Up, Down, Left, Right, Center) events correctly.
5. **Configures Permissions:** Show me what needs to be added to `AndroidManifest.xml` based on the configuration.
6. **Optimizes for TV:** Ensure the activity is set to Leanback mode and handles orientation correctly.

Please provide the `MainActivity.kt` logic, the `build.gradle` dependencies needed for Firebase/Firestore, and the `AndroidManifest.xml` structure."
