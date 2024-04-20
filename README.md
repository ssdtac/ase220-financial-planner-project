# ASE 220 Financial Planning Website Documentation

# [Project Video](https://www.youtube.com/watch?v=PUO_iO2qIAo)


## Contribution Summary - Assignment 10
Cassian Godsted - Setup Express to serve static files through NodeJS, replaced READ requests to Jsonblob with NodeJS equivalents. Fixed bugs with POST requests and ensured DELETE requests also remove the user from user index file.

Christian Lane - Replaced POST/PUT requests with NodeJS equivalents. Implemented verification of data types in request bodies.

Jeffrey Perdue - Replaced DELETE requests with NodeJS equivalents.

## Contribution Summary
Cassian Godsted - Created code to import from JSONblob. Defined initial structure for JSON. Created spending overview card, including a  progress bar based off recent spending, automatic calculation of how a user is spending based off of their needs/wants and their paycheck. Created persistent user storage through localstorage. CSS styling changes for login and details pages. Reorganized code for a more consistent site experience. Wrote contribution summary. General bugfixes.

Christian Lane - Added recent transactions table. Added user login and log out functionality that hides the main page when logged out. Created an add transaction modal. Reorganized the JSON structure so every user has their own blob. Recorded video. General bugfixes.

Jeffrey Perdue - Added additional details page for transactions. Added the ability to add and delete transactions. Added pagination for recent transactions. Wrote the README.

## Project Goal

The ASE 220 Financial Planning project is designed to help users manage their financial transactions effectively. It provides a platform where users can add, view, edit, and delete transactions related to their financial activities. The application aims to give users a clear overview of their spending, savings, and overall financial health, enabling better financial planning and management.

## How to Use

1. First, create a new user using the button in the top right. 
2. Sign in with that username.
3. You can then add recent transactions using the button in the top right. The dashboard will calculate your spending based off of 50% to needs, 20% to wants, and 30% to savings. How much that is will depend on how much income you add.

## Features

- **User Authentication**: Users can log in to access their personalized financial data. The authentication ensures data privacy and security.

- **Transaction Management**: Users can perform the following operations on transactions:
  - **Add Transaction**: Users can add new financial transactions by specifying details such as transaction type, date, vendor, amount, and category.
  - **View Transactions**: Users can view a summary of their transactions, including recent transactions and a spending overview that shows the percentage of funds allocated to needs, wants, and savings.
  - **Edit/Delete Transactions**: Users can modify the details of existing transactions or remove them entirely from their financial log.

- **Spending Overview**: The application provides a visual representation of spending, dividing expenses into categories such as needs, wants, and savings, helping users understand their spending habits.

- **Responsive Design**: The website is designed to be responsive, ensuring a seamless user experience across various devices and screen sizes.

## Technical Overview

- **Frontend**: The frontend is built using HTML, CSS, and JavaScript. Bootstrap is used for styling and responsiveness, while jQuery is utilized for DOM manipulation and event handling.

- **Backend Simulation**: Since this is a frontend-focused project, the backend is simulated using JSON files (`users.json`) to store user data and JSONBlob API for dynamic data storage and retrieval.

- **Key Files and Their Roles**:
  - `index.html`: The main page that users interact with. It includes the transaction overview, login/logout functionality, and the ability to add new transactions.
  - `global.js`:
    - Handles user authentication, including login and logout functionalities.
    - Handles all methods that are used by both the `index.html` page and the `transaction-detail.html` page.
  - `index.js`:
    - Loads all transaction content for individual users in `index.js`.
    - Visually switches css for `index.js` when user is logged in or out.
    - Implements the add transaction functionality.
    - Implements the add user functionality.
    - Calculates spending overview.
  - `date.js`: Contains utility functions for date manipulation.
  - `detail.js`: Manages the display, editing, and deleting of individual transaction details on the `transaction-detail.html` page.
  - `transaction-detail.html`: Provides the layout for viewing the details of a specific transaction, including options to edit or delete the transaction.
  - `users.json`: Stores user credentials and associated blob IDs for accessing their transaction data on JSONBlob.

## Workflow

1. **User Login**: Upon visiting the site, users are prompted to log in. The system checks the credentials against the `users.json` file.

2. **Viewing Transactions**: After successful login, users are directed to the main page where they can view their transaction summary and spending overview.

3. **Adding Transactions**: Users can add new transactions using the "Add Transaction" button, which opens a modal for entering transaction details.

4. **Editing/Deleting Transactions**: Each transaction in the recent transactions list has options to edit or delete, allowing users to keep their financial records up to date.

5. **Logout**: Users can log out of the application, which hides sensitive financial data and requires login credentials for re-entry.

## Conclusion

The ASE 220 Financial Planning website is a user-friendly tool for personal financial management. It emphasizes ease of use, data security, and effective financial tracking and planning. Future enhancements could include more detailed analytics, budgeting tools, and integration with financial institutions for real-time transaction tracking.
