# Project Continuation Guide - React Native & Expo Course

## ⚠️ CRITICAL: File System Location

**This project is located on the USER'S COMPUTER at:**

\\wsl$\Ubuntu\home\practicalace\projects\reactnative


### 🚨 MANDATORY FILE SYSTEM RULES

Claude has access to TWO different file systems:
1. **User's Computer** - Paths with `\\wsl$\` or `D:\` or `G:\` prefixes
2. **Claude's Computer** - Paths like `/home/claude` or `/mnt/user-data`

**FOR THIS PROJECT:**
- ✅ **ALWAYS USE:** `Filesystem:write_file`, `Filesystem:read_text_file`, `Filesystem:list_directory`, etc.
- ❌ **NEVER USE:** `create_file`, `bash_tool`, `str_replace`, `view` (these are for Claude's computer)

**Path Format Recognition:**
- `\\wsl$\Ubuntu\...` = User's computer → Use Filesystem tools
- `D:\...` or `G:\...` = User's computer → Use Filesystem tools  
- `/home/claude/...` = Claude's computer → Use computer use tools
- `/mnt/user-data/...` = Claude's computer → Use computer use tools

**If you see a path starting with `\\wsl$\`, `D:\`, or `G:\` - STOP and use Filesystem tools!**

---

## 🚨 START EVERY SESSION WITH THIS CHECKLIST

Before doing ANY work, Claude must read this file and output:

✓ File system location: [User's computer at \\wsl$\Ubuntu\home\practicalace\projects\reactnative]
✓ Tools to use: [Filesystem:read_text_file, Filesystem:write_file, Filesystem:edit_file]
✓ Current status: [fill in from "Current Status" section]
✓ Next task: [fill in from "Next Task" field]

**DO NOT PROCEED until this checklist is complete and confirmed by user.**

---

## Project Overview

**Project Name:** React Native & Expo Mastery Course

**Project Type:** Mobile Development Course (React Native + Expo + TypeScript)

**Working Directory:** \\wsl$\Ubuntu\home\practicalace\projects\reactnative

**Reference Template/Materials:** \\wsl$\Ubuntu\home\practicalace\projects\course_template (for HTML/CSS structure and styling)

**Syllabus:** reactnativecourse.md in project root

---

## Current Status

**Last Updated:** December 28, 2025

**Current Phase:** Module 8 Starting (Modules 1-7 Complete!)

**Progress:** 
- ✅ CSS merged (main.css now contains all needed styles, enhanced.css can be deleted)
- ✅ continue.md created
- ✅ index.html - COMPLETE (course homepage with all module links)
- ✅ Module 1: The Mental Shift — Web to Native (4/4 lessons complete)
- ✅ Module 2: Development Environment Setup (5/5 lessons complete)
- ✅ Module 3: Core Components — The Building Blocks (8/8 lessons complete)
- ✅ Module 4: StyleSheet Deep Dive (7/7 lessons complete)
- ✅ Module 5: Lists and Performance (7/7 lessons complete)
- ✅ Module 6: Navigation with Expo Router (8/8 lessons complete)
- ✅ Module 7: Data Management and Networking (5/5 lessons complete)
- ⏳ Modules 8-10: Pending

**Lessons Completed This Session:**
1. m07_l01_fetching_data.html (created as parts a/b)
2. m07_l02_data_fetching_libraries.html (created as parts a/b)
3. m07_l03_local_storage_options.html (created as parts a/b)
4. m07_l04_state_management_at_scale.html (created as parts a/b)
5. m07_l05_forms_and_validation.html (created as parts a/b)

**Next Task:** Create m08_l01_native_device_features.html (Module 8, Lesson 1)

---

## Course Structure (from reactnativecourse.md)

### Module 1: The Mental Shift — Web to Native (4 lessons)
- m01_l01_why_react_native.html
- m01_l02_web_vs_native_mental_models.html
- m01_l03_what_transfers_from_react.html
- m01_l04_react_native_ecosystem_overview.html

### Module 2: Development Environment Setup (5 lessons)
- m02_l01_expo_vs_bare_react_native.html
- m02_l02_installing_the_toolchain.html
- m02_l03_creating_your_first_project.html
- m02_l04_development_workflow.html
- m02_l05_development_builds.html

### Module 3: Core Components — The Building Blocks (8 lessons)
- m03_l01_view_the_universal_container.html
- m03_l02_text_typography_in_native.html
- m03_l03_image_displaying_visual_content.html
- m03_l04_scrollview_when_content_overflows.html
- m03_l05_safeareaview_respecting_device_boundaries.html
- m03_l06_pressable_handling_touch.html
- m03_l07_textinput_capturing_user_input.html
- m03_l08_switch_activityindicator_statusbar.html

### Module 4: StyleSheet Deep Dive (7 lessons) ✅ COMPLETE
- m04_l01_stylesheet_fundamentals.html ✅
- m04_l02_flexbox_in_react_native.html ✅
- m04_l03_common_layout_patterns.html ✅ (parts a/b/c)
- m04_l04_responsive_design.html ✅ (parts a/b/c)
- m04_l05_platform_specific_styles.html ✅ (parts a/b/c)
- m04_l06_animation_basics.html ✅ (parts a/b/c)
- m04_l07_theming_dark_mode.html ✅ (parts a/b/c)

### Module 5: Lists and Performance (7 lessons) ✅ COMPLETE
- m05_l01_why_scrollview_isnt_enough.html ✅
- m05_l02_flatlist_fundamentals.html ✅
- m05_l03_flatlist_performance_optimization.html ✅
- m05_l04_flatlist_features.html ✅
- m05_l05_sectionlist_for_grouped_data.html ✅
- m05_l06_infinite_scroll_and_pagination.html ✅
- m05_l07_flashlist_the_performance_alternative.html ✅

### Module 6: Navigation with Expo Router (8 lessons) ✅ COMPLETE
- m06_l01_navigation_concepts.html ✅ (parts a/b/c)
- m06_l02_expo_router_setup.html ✅ (parts a/b)
- m06_l03_stack_navigation.html ✅ (parts a/b)
- m06_l04_tab_navigation.html ✅ (parts a/b)
- m06_l05_nested_navigation.html ✅ (parts a/b)
- m06_l06_authentication_flows.html ✅ (parts a/b)
- m06_l07_deep_linking.html ✅ (parts a/b)
- m06_l08_advanced_patterns.html ✅ (parts a/b)

### Module 7: Data Management and Networking (5 lessons) ✅ COMPLETE
- m07_l01_fetching_data.html ✅ (parts a/b)
- m07_l02_data_fetching_libraries.html ✅ (parts a/b)
- m07_l03_local_storage_options.html ✅ (parts a/b)
- m07_l04_state_management_at_scale.html ✅ (parts a/b)
- m07_l05_forms_and_validation.html ✅ (parts a/b)

### Module 8: Native Features and Device APIs (7 lessons)
- m08_l01_permissions.html
- m08_l02_camera_and_media.html
- m08_l03_location_services.html
- m08_l04_notifications.html
- m08_l05_haptics_sensors_device_info.html
- m08_l06_sharing_and_linking.html
- m08_l07_file_system.html

### Module 9: Animations and Gestures (6 lessons)
- m09_l01_animation_fundamentals.html
- m09_l02_react_native_reanimated.html
- m09_l03_common_animation_patterns.html
- m09_l04_gesture_handler.html
- m09_l05_gesture_driven_animations.html
- m09_l06_lottie_animations.html

### Module 10: Production and Deployment (7 lessons)
- m10_l01_app_configuration_deep_dive.html
- m10_l02_environment_management.html
- m10_l03_building_with_eas_build.html
- m10_l04_over_the_air_updates.html
- m10_l05_app_store_deployment.html
- m10_l06_crash_reporting_and_analytics.html
- m10_l07_ci_cd_setup.html

### Appendices
- appendix_a_common_errors_and_solutions.html
- appendix_b_typescript_cheat_sheet.html
- appendix_c_component_reference.html
- appendix_d_web_to_native_quick_reference.html

**Total Lessons:** 65 + 4 appendices = 69 HTML files

---

## File Creation Guidelines

### Technical Requirements
- ✅ Mobile-friendly responsive design
- ✅ External CSS file: styles/main.css
- ✅ Link to /favicon.png in every file
- ✅ Filename convention: underscores_only (m01_l01_lesson_name.html)
- ✅ NO numbered headings in HTML content
- ✅ Include rich examples, analogies, metaphors, real-world scenarios
- ✅ Follow reference template structure exactly

### Required Structure Elements
- ✅ Skip to main content link for accessibility
- ❌ **NO progress indicator bar** (explicitly excluded per user preference)
- ✅ Top navigation with mobile menu toggle
- ✅ Breadcrumb navigation
- ✅ Sticky table of contents using `<details>` element
- ✅ Proper semantic sections with IDs matching TOC
- ✅ Learning objectives card
- ✅ Hands-on exercises with collapsible hints/solutions
- ✅ Lesson navigation (Previous/Home/Next)
- ✅ Footer

### Code & Illustrations

#### Visual Aid Decision Framework

**Choose the RIGHT visualization type for each concept:**

```
Need a visual? Ask:
├─ Is it a PROCESS or FLOW?
│  ├─ Yes → Use MERMAID (flowchart, sequence, state diagram)
│  └─ No → Continue...
├─ Is it a UI MOCKUP or STATIC DIAGRAM?
│  ├─ Yes → Use SVG (panels, toolbars, layouts, cards)
│  └─ No → Continue...
├─ Does it need CUSTOM RENDERING or ANIMATION?
│  └─ Yes → Use CANVAS (3D viz, gradients, interactive demos)
```

#### 1. Mermaid Diagrams
- ✅ Workflows and process flows
- ✅ Logic/decision trees
- ✅ Event sequences
- ✅ State machines
- ✅ Class hierarchies

**Implementation:**
```html
<!-- In <head> -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script>

<!-- In content -->
<pre class="mermaid">
flowchart LR
    A[Start] --> B{Decision}
</pre>
```

#### 2. SVG Graphics
- ✅ UI panel mockups
- ✅ Static diagrams with precise shapes
- ✅ Reference cards
- ✅ Interface elements

#### 3. Canvas Elements
- ✅ Custom 3D-like visualizations
- ✅ Gradient-based rendering
- ✅ Animated or interactive concepts
- ⚠️ **MANDATORY**: Every canvas needs a unique `id` attribute
- ⚠️ **MANDATORY**: Wrap JavaScript in IIFE: `(function() { ... })()`

### Card Styling Reference
```html
<!-- Definition Card (Purple gradient) -->
<div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
    <h4>📖 Definition</h4>
    <p style="color: white;"><strong>Term:</strong> Definition text</p>
</div>

<!-- Success/Tip Card (Green) -->
<div class="card" style="background: #e8f5e9; border-left: 4px solid #4CAF50;">
    <h4>✅ Pro Tip</h4>
    <p>Tip text</p>
</div>

<!-- Warning Card (Yellow) -->
<div class="card" style="background-color: #fff3cd; border-left: 4px solid #ffc107;">
    <h4>⚠️ Watch Out</h4>
    <p>Warning text</p>
</div>

<!-- Info Card (Blue) -->
<div class="card" style="background: #e3f2fd; border-left: 4px solid #2196F3;">
    <h4>💡 Information</h4>
    <p>Info text</p>
</div>
```

### Teaching Style
- **Tone**: Friendly, accessible instructor voice
- **Audience**: Web developers with React experience learning mobile development
- **Approach**: Patient, clear explanations with plenty of examples and analogies
- **Pacing**: Pause after each file completion and ask for confirmation to continue

---

## Multi-Part File Workflow

**When content is small enough:** Create single file directly

**When content is large:** Create parts (a, b, c) in ROOT folder:
- Part A: DOCTYPE, head, opening sections
- Part B+: Middle content sections  
- Final Part: Closing sections, navigation, footer, closing tags

**User combines parts manually after creation.**

---

## Tool Selection Strategy

### When to Edit vs. Write

**Use `Filesystem:edit_file` when:**
- Making targeted changes to existing files
- Updating specific sections or values

**Use `Filesystem:write_file` when:**
- Creating brand new files
- Complete rewrites where most content changes

---

## Progress Tracking

**Total Lessons Planned:** 68 files (64 lessons + 4 appendices)
**Lessons Completed:** 44
**Overall Progress:** 68.8% (44/64 lessons)

### Session History
- **December 27, 2025 (Session 1):** Project setup. Merged main.css and enhanced.css into single main.css. Created continue.md. Ready to create index.html.
- **December 27, 2025 (Session 2):** Created index.html, completed all Module 1 lessons (4), completed all Module 2 lessons (5). Total: 9 lessons created. Visual aids include Mermaid diagrams, SVG graphics, and extensive code examples. Each lesson follows mobile-friendly template with learning objectives, TOC, cards, and exercises.
- **December 27, 2025 (Session 3):** Completed Module 3 Lessons 1-5 (View, Text, Image, ScrollView, SafeAreaView). Created as multi-part files for user to combine. Total: 14 lessons created (21.5% complete). Established multi-part workflow for substantial lessons.
- **December 27, 2025 (Session 4):** Completed Module 3 Lessons 6-8 (Pressable, TextInput, Switch/ActivityIndicator/StatusBar). Module 3 COMPLETE! Total: 17 lessons created (26.2% complete).
- **December 28, 2025 (Session 5):** Completed Module 4 Lessons 1-2 (StyleSheet Fundamentals, Flexbox). Started multi-part file approach for substantial lessons. Total: 19 lessons created (29.2% complete).
- **December 28, 2025 (Session 6):** Completed Module 4 Lessons 3-7 (Common Layout Patterns, Responsive Design, Platform-Specific Styles, Animation Basics, Theming and Dark Mode). Module 4 COMPLETE! All created as multi-part files (a/b/c) for user to combine. Total: 24 lessons created (36.9% complete).
- **December 28, 2025 (Session 7):** Completed Module 5 all 7 lessons (Why ScrollView Isn't Enough, FlatList Fundamentals, FlatList Performance, FlatList Features, SectionList, Infinite Scroll/Pagination, FlashList). Module 5 COMPLETE! Total: 31 lessons created (47.7% complete).
- **December 28, 2025 (Session 8):** Completed Module 6 all 8 lessons (Navigation Concepts, Expo Router Setup, Stack Navigation, Tab Navigation, Nested Navigation, Authentication Flows, Deep Linking, Advanced Patterns). Module 6 COMPLETE! Fixed missing </script> tag in m06_l06 part a. Total: 39 lessons created (60.0% complete).
- **December 28, 2025 (Session 9):** Completed Module 7 all 5 lessons (Fetching Data, Data Fetching Libraries, Local Storage Options, State Management at Scale, Forms and Validation). Module 7 COMPLETE! Note: Module 7 has 5 lessons (not 6 as originally planned - offline-first patterns merged into other lessons). Total: 44 lessons created (68.8% complete).

---

## Important Reminders

### For Claude:
- **Always verify path format before choosing tools**
- **Path with `\\wsl$\` = Filesystem tools required**
- **Read existing files to match style and structure**
- **Create complete, production-ready content**
- **Pause after each major file for user confirmation**
- **NO progress indicator bar in lessons**
- **Link to /favicon.png (not .ico)**

### For User:
- **State "Use Filesystem tools" if Claude uses wrong ones**
- **Provide full path including `\\wsl$\` prefix**
- **Update continue.md at end of each session**
- **Delete enhanced.css (no longer needed)**

---

**Template Version:** 1.0
**Created:** December 27, 2025
**Purpose:** Ensure continuity across chat sessions and prevent file system tool confusion
