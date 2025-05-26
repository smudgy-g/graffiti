# Graffiti

## Project: Real-time Collaborative Whiteboard/Drawing App

**Core Concept:** Multiple users can connect to a shared canvas and draw simultaneously, with their actions instantly visible to everyone else connected.

### Key Technologies:

-   **Flask (Backend):**
    -   **Flask-SocketIO:** Essential for real-time, bi-directional communication (WebSockets).
    -   **SQLAlchemy (with PostgreSQL):** For storing drawing sessions, user data, and potentially past drawings.
    -   **Basic REST API:** For creating/loading drawing sessions, user management.
-   **React (Frontend):**
    -   **HTML Canvas API:** The core for drawing.
    -   **Socket.IO Client Library:** To connect to and communicate with the Flask-SocketIO server.
    -   **State Management:** Undecided.
-   **Other Potential Libraries/Tools:**
    -   **UI Framework (Optional):** Undecided.
    -   **UUID:** For generating unique IDs for drawing sessions.

### Architectural Overview:

1. **Client (React App):**
    - User interacts with drawing tools (brush, color picker, eraser).
    - When a user draws, their browser captures mouse/touch events.
    - Drawing data (e.g., starting point, end point, color, brush size, tool type) is sent via Socket.IO to the Flask server.
    - When the client receives drawing data from the server (originating from any connected user), it renders that data onto its local HTML Canvas.
2. **Server (Flask App):**
    - Maintains a list of active drawing sessions.
    - Uses Flask-SocketIO to:
        - Listen for `connect` and `disconnect` events from clients.
        - Listen for `drawing` events from clients.
        - When a `drawing` event is received, _broadcast_ that drawing data to _all other clients_ in the same drawing session (or room).
        - Potentially store drawing actions in a database for persistence (e.g., when a user joins, they receive the full history of the current drawing).
