MEAN Stack Project

This repository contains both the frontend and backend of my personal hobby project about famous paintings by renowned artists.

Frontend: Angular application
Backend: Node.js Express application
How to Start the Application

    1. Start the Backend:
    Run npm run start:backend to start the Express server using nodemon.

    2. Start the Frontend:
    Run npm run start:frontend to navigate to the public-frontend folder and start the Angular application.

    3. Start Both Frontend and Backend Concurrently:
    Run npm run dev to start both the backend and frontend concurrently.

Features

    - User Registration: Encrypts user passwords during registration.
    - JWT Authorization: Uses JWT tokens to authorize access.
    - Browse Paintings: Any user can browse the available famous paintings by renowned artists.
    - Registered Users: Registered users can add and delete paintings.
    
Button Explanations

    About Button (/about):
        Purpose: Navigates to the "About" page of the application.
        Display Condition: Always visible, regardless of whether the user is logged in or not. This page contains information about my                                           PHP application.

    Paintings Button (/paintings):
        Purpose: Navigates to a page that displays a list of famous paintings.
        Display Condition: Always visible. Any user, whether logged in or not, can view the paintings available in the application.

    Add Painting Button (/add-painting):
        Purpose: Navigates to a page where users can add a new painting to the collection.
        Display Condition: Visible only if the user is logged in (*ngIf="isLoggedIn()"). This ensures that only authenticated users who have the                                 necessary permissions can add new paintings.

    Signup Button (/add-user):
        Purpose: Navigates to the Signup page where new users can create an account.
        Display Condition: Visible only if the user is not logged in (*ngIf="!isLoggedIn()"). This prevents logged-in users from seeing the Signup                               option, as they already have an account.

    Login Button (/login):
        Purpose: Navigates to the Login page where users can log into their accounts.
        Display Condition: Visible only if the user is not logged in (*ngIf="!isLoggedIn()"). Once the user logs in, this button is replaced by the                              Logout button.

    Logout Button:
        Purpose: Logs the user out by removing the authentication token from local storage and redirects them to the login page.
        Display Condition: Visible only if the user is logged in (*ngIf="isLoggedIn()"). This allows authenticated users to log out of their account.

        
