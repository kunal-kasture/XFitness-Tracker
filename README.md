\# XFitnessTracker

A responsive Health and Fitness Tracker dashboard built with React, Vite, and Recharts. The application allows users to log daily caloric intake versus burn, persist records locally, and visualize health habits with real-time charts.

\---

\### Deployment Link

Link:

\---

\### Features

\* \*\*Daily Metric Logging:\*\* Modal-driven controlled form to record daily calorie intake, calories burned, dates, and workout descriptions.

\* \*\*Persistent Storage:\*\* Synchronizes data with browser `localStorage` for offline session persistence across refreshes.

\* \*\*Dynamic Visualizations:\*\*

&#x20; \* \*\*Weekly Health Trends:\*\* A responsive Recharts Bar Chart dynamically filtered to show records strictly within the rolling last 7 days.

&#x20; \* \*\*Overall Data:\*\* A Recharts Pie Chart rendering proportional calorie intake vs. burned distributions with percentage labels.

\* \*\*CRUD Management:\*\* View chronological records and immutably remove entries.

\* \*\*Defensive Empty States:\*\* Clean fallbacks and conditional rendering when no recent or overall data is available.

\---

\### Tech Stack

\* \*\*Frontend:\*\* React, HTML5, CSS3

\* \*\*Charts:\*\* Recharts

\* \*\*Tooling:\*\* Vite, Cypress

\---

\### Getting Started

1\. \*\*Clone the repository:\*\*

&#x20; ```bash

&#x20; git clone \[https://github.com/](https://github.com/)<your-username>/XFitnessTracker.git

&#x20; cd XFitnessTracker

2\. \*\*Install dependencies:\*\*

&#x20; ```bash

&#x20; npm install

3\. \*\*Start the server:\*\*

&#x20; ```bash

&#x20; npm start
