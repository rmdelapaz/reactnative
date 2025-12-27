# React Native & Expo Mastery Course

## Course Overview

**Title:** React Native & Expo: From Web Developer to Mobile App Creator

**Tagline:** Leverage your React skills to build production-ready iOS and Android apps

**Target Audience:** Web developers with React experience who want to build native mobile applications

**Prerequisites:**
- Solid understanding of React (components, hooks, state management)
- JavaScript/TypeScript fundamentals
- Basic command line familiarity

**Course Duration:** 40-50 hours of content across 10 modules

**Tech Stack:**
- React Native (latest stable)
- Expo SDK 52+
- Expo Router
- TypeScript
- React Native Reanimated

---

## Module 1: The Mental Shift — Web to Native

### Learning Objectives
- Understand fundamental differences between web and native development
- Recognize why certain web patterns don't translate to mobile
- Set proper expectations for the learning journey

### Lesson 1.1: Why React Native?
- The mobile development landscape
- Native vs hybrid vs cross-platform approaches
- Where React Native fits in 2024+
- Companies using React Native at scale
- When React Native is (and isn't) the right choice

### Lesson 1.2: Web vs Native Mental Models
- No DOM, no browser, no CSS
- Native components vs HTML elements
- The bridge architecture (and why it matters less now with the new architecture)
- Platform differences: iOS vs Android thinking
- Performance expectations and realities

### Lesson 1.3: What Transfers From React (and What Doesn't)
- Components, props, state — all transfer
- Hooks — all transfer
- Context and state management — transfers
- Styling — requires relearning
- Routing — different paradigm
- Event handling — touch vs click

### Lesson 1.4: The React Native Ecosystem Overview
- React Native core vs community packages
- Expo: what it is and why it exists
- Popular libraries you'll encounter
- Documentation and community resources

**Module Project:** None (conceptual foundation)

---

## Module 2: Development Environment Setup

### Learning Objectives
- Set up a complete React Native development environment
- Understand different development workflows
- Successfully run an app on physical devices and simulators

### Lesson 2.1: Expo vs Bare React Native
- What Expo provides out of the box
- The evolution of Expo (no longer "limited")
- Managed vs bare workflow
- When you might need to eject (rare now)
- Expo Application Services (EAS) overview

### Lesson 2.2: Installing the Toolchain
- Node.js requirements
- Installing Expo CLI
- Expo Go app on your devices
- Watchman (macOS/Linux)
- iOS Simulator setup (macOS only)
- Android Studio and emulator setup
- VS Code extensions for React Native

### Lesson 2.3: Creating Your First Project
- `npx create-expo-app` walkthrough
- Project structure tour
- Understanding app.json / app.config.js
- The entry point: App.tsx
- Running with `npx expo start`

### Lesson 2.4: Development Workflow
- Expo Go for rapid development
- QR code scanning
- Hot reloading vs fast refresh
- Shake menu and developer tools
- Debugging with React DevTools
- Console logging and viewing logs

### Lesson 2.5: Development Builds
- When Expo Go isn't enough
- Creating development builds with EAS
- Running on simulators vs physical devices
- Debugging native crashes

**Module Project:** Set up environment, create first app, run on physical device and simulator

---

## Module 3: Core Components — The Building Blocks

### Learning Objectives
- Master the essential React Native components
- Understand component-specific props and behaviors
- Build basic UI structures confidently

### Lesson 3.1: View — The Universal Container
- View as the fundamental building block
- Nesting views for structure
- View vs div: key differences
- Accessibility props on View
- Common View patterns

### Lesson 3.2: Text — Typography in Native
- Why text must be wrapped in Text components
- Text nesting and inheritance (the exception to "no cascade")
- numberOfLines and ellipsizeMode
- Selectable text
- Platform-specific text rendering

### Lesson 3.3: Image — Displaying Visual Content
- Local images with require()
- Remote images with uri
- Image sizing and resizeMode
- Background images (ImageBackground)
- Image caching considerations
- Placeholder and loading states
- Using expo-image for better performance

### Lesson 3.4: ScrollView — When Content Overflows
- Basic scrolling behavior
- Horizontal vs vertical scrolling
- contentContainerStyle vs style
- Pull to refresh
- Keyboard avoiding behavior
- When NOT to use ScrollView (performance)

### Lesson 3.5: SafeAreaView — Respecting Device Boundaries
- The notch problem
- SafeAreaView from react-native
- expo-safe-area-context for more control
- Platform-specific safe areas

### Lesson 3.6: Pressable — Handling Touch
- The modern touch handler
- Press states: onPressIn, onPressOut, onPress, onLongPress
- Visual feedback with style function
- HitSlop for better touch targets
- Why Pressable over TouchableOpacity/TouchableHighlight

### Lesson 3.7: TextInput — Capturing User Input
- Controlled vs uncontrolled inputs
- Keyboard types
- Secure text entry
- Multiline inputs
- Focus management
- Keyboard dismissal patterns
- Platform differences in styling

### Lesson 3.8: Switch, ActivityIndicator, and StatusBar
- Boolean toggles with Switch
- Loading states with ActivityIndicator
- Controlling the status bar appearance

**Module Project:** Build a "Profile Card" component combining all core components

---

## Module 4: StyleSheet Deep Dive

### Learning Objectives
- Master the StyleSheet API completely
- Build responsive layouts without CSS media queries
- Handle platform-specific styling elegantly

### Lesson 4.1: StyleSheet Fundamentals
- StyleSheet.create() and why it matters
- Object syntax: camelCase properties
- Numeric values (no 'px' needed)
- Color values (hex, rgb, rgba, named)
- Style composition with arrays

### Lesson 4.2: Flexbox in React Native
- Default flexDirection is column (not row!)
- flex: 1 and what it really means
- justifyContent and alignItems
- alignSelf for individual items
- flexWrap and flexGrow
- The gap property (newer RN versions)

### Lesson 4.3: Common Layout Patterns
- Centering content (horizontal and vertical)
- Header/content/footer layouts
- Side-by-side layouts
- Card layouts
- Absolute positioning when needed
- Z-index handling

### Lesson 4.4: Responsive Design Without Media Queries
- Dimensions API
- useWindowDimensions hook
- Percentage-based sizing
- Aspect ratio
- Orientation handling
- Breakpoint patterns in React Native

### Lesson 4.5: Platform-Specific Styles
- Platform.OS checks
- Platform.select() for cleaner code
- Platform-specific file extensions (.ios.js, .android.js)
- Handling platform quirks
- Shadow on iOS vs elevation on Android

### Lesson 4.6: Dynamic and Conditional Styles
- Style arrays for composition
- Conditional styles with spreading
- Computed styles based on props/state
- Theme-aware components
- Style props pattern

### Lesson 4.7: Organizing Styles at Scale
- Colocation vs separation
- Shared style constants
- Theme objects
- Design tokens approach
- When to use styled-components or alternatives

**Module Project:** Build a responsive card grid that adapts to screen size and platform

---

## Module 5: Lists and Performance

### Learning Objectives
- Implement performant lists for any data size
- Understand virtualization and why it matters
- Handle common list patterns like infinite scroll

### Lesson 5.1: Why ScrollView Isn't Enough
- The memory problem with large datasets
- Understanding virtualization
- When ScrollView is still fine

### Lesson 5.2: FlatList Fundamentals
- data, renderItem, and keyExtractor
- Understanding the key prop importance
- Scroll and reference methods
- Content container styling

### Lesson 5.3: FlatList Performance Optimization
- getItemLayout for fixed-height items
- windowSize and initialNumToRender
- maxToRenderPerBatch and updateCellsBatchingPeriod
- removeClippedSubviews
- Memoization strategies

### Lesson 5.4: FlatList Features
- ListHeaderComponent and ListFooterComponent
- ListEmptyComponent
- ItemSeparatorComponent
- Pull to refresh
- Horizontal lists
- Multiple columns with numColumns

### Lesson 5.5: SectionList for Grouped Data
- When to use SectionList vs FlatList
- Section headers
- Data structure requirements
- Sticky headers

### Lesson 5.6: Infinite Scroll and Pagination
- onEndReached and onEndReachedThreshold
- Loading more data patterns
- Cursor vs offset pagination
- Handling loading and error states

### Lesson 5.7: FlashList — The Performance Alternative
- Why Shopify built FlashList
- Migration from FlatList
- estimatedItemSize
- When FlashList makes sense

**Module Project:** Build a social media-style feed with infinite scroll, pull-to-refresh, and multiple content types

---

## Module 6: Navigation with Expo Router

### Learning Objectives
- Implement file-based routing with Expo Router
- Build all common navigation patterns
- Handle deep linking and authentication flows

### Lesson 6.1: Navigation Concepts
- Stack-based navigation history
- Tab-based navigation
- Drawer navigation
- Modal presentation
- How mobile navigation differs from web

### Lesson 6.2: Expo Router Setup
- File-based routing explained
- The app directory structure
- _layout files and their role
- Index routes

### Lesson 6.3: Stack Navigation
- Creating screen stacks
- Navigating with Link and router
- Passing and receiving params
- Screen options and headers
- Custom header components
- Presentation modes (card, modal, transparentModal)

### Lesson 6.4: Tab Navigation
- Bottom tabs with Tabs layout
- Tab icons and badges
- Tab bar customization
- Hiding tabs on specific screens
- Tab press behavior

### Lesson 6.5: Nested Navigation
- Stacks inside tabs
- Groups for organization
- Shared routes
- Navigation state persistence

### Lesson 6.6: Authentication Flows
- Protected routes pattern
- Redirect on auth state
- Login/logout flow
- Splash screen handling
- Deep linking with authentication

### Lesson 6.7: Deep Linking
- Universal links (iOS) and App Links (Android)
- URL scheme handling
- Expo Router linking configuration
- Testing deep links

### Lesson 6.8: Advanced Patterns
- Custom transitions
- Shared element transitions
- Preventing back navigation
- Navigation events and listeners

**Module Project:** Build a multi-tab app with authentication, protected routes, and deep linking

---

## Module 7: Data Management and Networking

### Learning Objectives
- Fetch and manage remote data effectively
- Implement local storage solutions
- Handle offline scenarios

### Lesson 7.1: Fetching Data
- fetch() in React Native
- Handling loading, success, and error states
- Abort controllers for cleanup
- Environment variables for API URLs

### Lesson 7.2: Data Fetching Libraries
- React Query / TanStack Query
- SWR
- Automatic caching and revalidation
- Optimistic updates
- Infinite query patterns

### Lesson 7.3: Local Storage Options
- AsyncStorage basics
- expo-secure-store for sensitive data
- MMKV for performance-critical storage
- When to use each option

### Lesson 7.4: State Management at Scale
- When Context isn't enough
- Zustand for lightweight global state
- Redux Toolkit if needed
- State persistence patterns

### Lesson 7.5: Forms and Validation
- Controlled form patterns
- React Hook Form in React Native
- Zod for validation
- Form state management
- Keyboard handling in forms

### Lesson 7.6: Offline-First Patterns
- Detecting network state
- Queue operations for later
- Conflict resolution strategies
- Cache-first approaches

**Module Project:** Build a notes app with cloud sync, offline support, and local persistence

---

## Module 8: Native Features and Device APIs

### Learning Objectives
- Access device hardware and sensors
- Implement common native features
- Handle permissions properly

### Lesson 8.1: Permissions
- The permission model on iOS vs Android
- expo-permissions patterns
- Requesting at the right time
- Handling denied permissions gracefully

### Lesson 8.2: Camera and Media
- expo-camera for camera access
- expo-image-picker for photo library
- expo-media-library for saving media
- expo-av for audio and video playback

### Lesson 8.3: Location Services
- expo-location basics
- Foreground vs background location
- Geofencing
- Battery considerations

### Lesson 8.4: Notifications
- expo-notifications setup
- Push notification tokens
- Local notifications
- Notification handlers
- Notification categories and actions

### Lesson 8.5: Haptics, Sensors, and Device Info
- expo-haptics for tactile feedback
- Accelerometer and gyroscope
- expo-device for device information
- expo-constants for app constants

### Lesson 8.6: Sharing and Linking
- expo-sharing for share sheets
- expo-linking for opening URLs
- Deep linking into other apps
- expo-clipboard

### Lesson 8.7: File System
- expo-file-system basics
- Downloading files
- Reading and writing files
- Managing cached data

**Module Project:** Build a photo journal app using camera, location, local storage, and sharing

---

## Module 9: Animations and Gestures

### Learning Objectives
- Create fluid animations that feel native
- Implement gesture-based interactions
- Understand when to use different animation approaches

### Lesson 9.1: Animation Fundamentals
- Why animation matters for UX
- Performance: JS thread vs UI thread
- React Native Animated API basics
- Timing, spring, and decay animations

### Lesson 9.2: React Native Reanimated
- Why Reanimated over Animated
- Shared values
- useAnimatedStyle
- Running on the UI thread

### Lesson 9.3: Common Animation Patterns
- Fade in/out
- Slide transitions
- Scale effects
- Rotation
- Layout animations
- Entering and exiting animations

### Lesson 9.4: Gesture Handler
- React Native Gesture Handler overview
- Tap gestures
- Pan gestures
- Pinch and rotation
- Composing gestures

### Lesson 9.5: Gesture-Driven Animations
- Linking gestures to animations
- Swipe-to-delete pattern
- Pull-to-refresh custom implementations
- Drag-and-drop
- Bottom sheet patterns

### Lesson 9.6: Lottie Animations
- What Lottie is
- Using lottie-react-native
- Controlling playback
- When to use Lottie vs code

**Module Project:** Build an interactive card stack with swipe gestures (like dating apps)

---

## Module 10: Production and Deployment

### Learning Objectives
- Build and deploy to app stores
- Configure app metadata and assets
- Implement CI/CD for mobile

### Lesson 10.1: App Configuration Deep Dive
- app.json vs app.config.js
- App name, bundle ID, and versioning
- Permissions configuration
- Splash screen and app icons
- expo-asset for bundled assets

### Lesson 10.2: Environment Management
- Development, staging, production configs
- expo-constants for env access
- EAS environment variables
- Secrets management

### Lesson 10.3: Building with EAS Build
- EAS Build overview
- Build profiles configuration
- iOS builds without a Mac
- Android build types (APK vs AAB)
- Custom native code handling

### Lesson 10.4: Over-the-Air Updates
- EAS Update explained
- When OTA works (and when it doesn't)
- Update channels and branches
- Rollback strategies
- Monitoring update adoption

### Lesson 10.5: App Store Deployment
- Apple App Store requirements
- TestFlight for iOS testing
- Google Play Store requirements
- Internal testing tracks
- Store listing optimization basics

### Lesson 10.6: Crash Reporting and Analytics
- Sentry integration
- expo-analytics options
- Error boundaries in React Native
- Performance monitoring

### Lesson 10.7: CI/CD Setup
- GitHub Actions with EAS
- Automating builds on push
- Automating submissions
- Version bumping strategies

**Module Project:** Deploy your Module 6 app to TestFlight and Google Play Internal Testing

---

## Appendix A: Common Errors and Solutions

A reference guide covering:
- Red box errors and their meanings
- Metro bundler issues
- Native dependency problems
- Build failures and fixes
- Debugging strategies

## Appendix B: TypeScript Cheat Sheet

Quick reference for:
- Typing components and props
- Navigation types
- Style types
- Event handler types
- Common utility types for RN

## Appendix C: Component Reference

Quick lookup for:
- All core components and key props
- Common Expo SDK components
- Recommended community components

## Appendix D: From Web to Native Quick Reference

Side-by-side comparisons:
- HTML element → RN component mappings
- CSS property → StyleSheet property mappings
- Web API → RN/Expo API mappings

---

## Course Capstone Project

**Build a Complete App: TaskFlow**

A full-featured task management app incorporating:
- Authentication (sign up, login, logout)
- Multiple navigation patterns (tabs, stacks, modals)
- Task CRUD with remote API
- Offline support with sync
- Push notifications for reminders
- Camera for task attachments
- Animations for task completion
- Production deployment

This project spans the final two weeks and reinforces every major concept from the course.

---

## Course Delivery Notes

### Suggested Lesson Format
1. **Concept Introduction** (video/text) — What and why
2. **Live Coding Demo** (video) — How, with narration
3. **Hands-On Exercise** — Learner practices
4. **Challenge** — Extended exercise without scaffolding
5. **Quiz** — Concept verification

### Code Repository Structure
```
/course-repo
  /module-01
    /lesson-01-starter
    /lesson-01-solution
  /module-02
    ...
  /capstone
    /starter
    /solution
```

### Assessment Strategy
- Module quizzes (concept verification)
- Module projects (practical application)
- Capstone project (comprehensive assessment)
- Optional: Code review submissions
