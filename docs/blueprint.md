# **App Name**: Site2Fire

## Core Features:

- Project Configuration: Users input basic project metadata, including App Title, Web URL (with validation), and automatically generated Package Name.
- Fire TV Optimization Settings: Adjust Fire TV specific settings, such as a toggle for 'D-Pad Navigation Support' and selection of default orientation (Landscape).
- App Icon Management: A dedicated section to upload an app icon, with a live preview in a 512x512 container for visual verification.
- AI-Powered D-Pad Script Tool: Utilize an AI tool to analyze the provided URL and suggest/generate optimal JavaScript snippets for D-Pad navigation to enhance Fire TV compatibility. Prioritize low-latency navigation logic specifically for sports rule-sets (like NFHS baseball rules).
- Build Request and Progress: An interface to initiate the build process by preparing a JSON configuration for a backend service, displaying a high-quality animation to simulate APK compilation progress.
- Build Output and Download: Manage and view the status of completed builds, and provide direct download links for the generated APK files (retrieved from the backend service).
- Application Navigation: A clear navigation system with links for 'New Project,' 'My Builds' (to view past projects), and 'Settings' pages for a streamlined user experience.
- Offline Resilience: Include a requirement for basic offline caching of the most recent build configurations.
- Database & Storage: Use Cloud Firestore for storing D-Pad JavaScript snippets and Firebase Storage for managing the 512x512 app icons.
- Backend Logic: Use Cloud Functions (Node.js) to bridge the AI tool with the build request process, ensuring the AI-generated scripts are validated before being packaged.
- Automated Environment Cleanup: Include a developer utility script (e.g., npm run clean:all) that safely purges .gradle, /build, and temporary cache folders without touching the /app or /src directories.
- Project Structure: Flat Root Architecture: Ensure the project root remains clean. Firebase configuration files must live in the absolute root, and source code stays in defined, non-nested directories (e.g., /web and /core).

## Style Guidelines:

- Scheme: Dark. Background: Deep charcoal (#151718), a very dark cool grey for a sleek foundation. Its hue is 220, saturation 15%, brightness 8%.
- Primary: Muted professional blue-grey (#A7ACB3) for general UI elements and text. Its hue is 220, saturation 10%, brightness 65%. It provides strong readability on the dark background.
- Accent: Fire orange (#FA8228), as specified by the user. This vibrant color will be used sparingly for calls-to-action, active states, and critical highlights to draw attention.
- Body and Headline Font: 'Inter' (sans-serif) for its modern, clean, and highly legible appearance, suitable for a technical utility application.
- Utilize 'Lucide Icons' for their consistent, modern, and outline-based aesthetic, ensuring crisp and understandable visual cues throughout the interface.
- Implement a clean, card-based input system on a single-page dashboard or step-by-step wizard to prevent visual clutter and guide the user through the process, aligning with 'Simplicity' requirements.
- Incorporate subtle yet high-quality animations, particularly during the 'Building APK' simulation, to provide clear feedback and enhance user engagement.