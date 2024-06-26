# ASE 220 Financial Planning Website Documentation

# [Final Project Video](https://www.youtube.com/watch?v=n2-1RlvmHHA)

## Contribution Summary - Final Project

Cassian Godsted - Created MongoDB authentication. Ported frontend login, add user, update user, create user, delete user to MongoDB. Fix bugs with dashboard appearence from port. Required only hashed passwords to be used in user creation and login. General bufixes.

Christian Lane - Seperated login page functionality. Helped with frontend login MongoDB port. implemented JSON Webtoken Auth for Dashboard and Detail pages, as well as adding, editing, and deleting transactions for the user, making them more secure. General bugfixes.

Jeffrey Perdue - Created JSON Webtoken Auth method

## Project Goal

The ASE 220 Financial Planning project is designed to help users manage their financial transactions effectively. It provides a platform where users can add, view, edit, and delete transactions related to their financial activities. The application aims to give users a clear overview of their spending, savings, and overall financial health, enabling better financial planning and management.

## How to Use

1. Start the server with `node server`, and connect to http://localhost:5500. You'll need to create a file named `uri.txt` in the root directory. The oontents of the file should be the MongoDB URI for it to work. The MongoDB database should be named `financial-planner` and the collection should be named `users`.
  - Example URI:
```
mongodb+srv://{USERNAMEHERE}:{PASSWORDHERE}@cluster0.{MONGODBSERVERHERE}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
2. First, create a new user using the button in the top right. 
3. Sign in with that username.
4. You can then add recent transactions using the button in the top right. The dashboard will calculate your spending based off of 50% to needs, 20% to wants, and 30% to savings. How much that is will depend on how much income you add.

## Features

- **User Authentication**: Users can log in to access their personalized financial data. The authentication ensures data privacy and security.

- **Transaction Management**: Users can perform the following operations on transactions, only when authenticated:
  - **Add Transaction**: Users can add new financial transactions by specifying details such as transaction type, date, vendor, amount, and category.
  - **View Transactions**: Users can view a summary of their transactions, including recent transactions and a spending overview that shows the percentage of funds allocated to needs, wants, and savings.
  - **Edit/Delete Transactions**: Users can modify the details of existing transactions or remove them entirely from their financial log.

- **Spending Overview**: The application provides a visual representation of spending, dividing expenses into categories such as needs, wants, and savings, helping users understand their spending habits.

- **Responsive Design**: The website is designed to be responsive, ensuring a seamless user experience across various devices and screen sizes.

## Technical Overview

- **Frontend**: The frontend is built using HTML, CSS, and JavaScript. Bootstrap is used for styling and responsiveness, while jQuery is utilized for DOM manipulation and event handling.

- **Backend**: The backend is a MongoDB Atlas database.

- **Key Files and Their Roles**:
  - `server.js`: The Node server file, which handles communication with the backend and serving frontend HTML/CSS/JS.
  - `index.html`: The index page handles login/logout functionality.
  - `dashboard.html`: The main page that users interact with. It includes the transaction overview, and the ability to add new transactions.
  - `dashboard.js`
      - Loads all transaction content for individual users.
      - Implements the add transaction functionality.
      - Calculates spending overview.
  - `global.js`:
    - Handles user authentication, including login and logout functionalities.
    - Handles all methods that are used by both the `dashboard.html` page and the `transaction-detail.html` page.
  - `index.js`: Implements the add user functionality.
  - `date.js`: Contains utility functions for date manipulation.
  - `detail.js`: Manages the display, editing, and deleting of individual transaction details on the `transaction-detail.html` page.
  - `transaction-detail.html`: Provides the layout for viewing the details of a specific transaction, including options to edit or delete the transaction.

## Workflow

1. **User Login**: Upon visiting the site, users are prompted to log in. They can then either create an account or log in to an existing account. The application uses MongoDB and JSON web token for authentication, and users that do not have a valid web token cannot view, edit, or delete transactions.

2. **Viewing Transactions**: After successful login, users are directed to the main page where they can view their transaction summary and spending overview.

3. **Adding Transactions**: Users can add new transactions using the "Add Transaction" button, which opens a modal for entering transaction details.

4. **Editing/Deleting Transactions**: Each transaction in the recent transactions list has options to edit or delete, allowing users to keep their financial records up to date.

5. **Logout**: Users can log out of the application, which hides sensitive financial data and requires login credentials for re-entry.

## Conclusion

The ASE 220 Financial Planning website is a user-friendly tool for personal financial management. It emphasizes ease of use, data security, and effective financial tracking and planning. Future enhancements could include more detailed analytics, budgeting tools, and integration with financial institutions for real-time transaction tracking.

## Contribution Summary - Assignment 10
Cassian Godsted - Setup Express to serve static files through NodeJS, replaced READ requests to Jsonblob with NodeJS equivalents. Fixed bugs with POST requests and ensured DELETE requests also remove the user from user index file.

Christian Lane - Replaced POST/PUT requests with NodeJS equivalents. Implemented verification of data types in request bodies.

Jeffrey Perdue - Replaced DELETE requests with NodeJS equivalents.

## Contribution Summary - Midterm Project
[Midterm Project Video](https://www.youtube.com/watch?v=PUO_iO2qIAo)

Cassian Godsted - Created code to import from JSONblob. Defined initial structure for JSON. Created spending overview card, including a  progress bar based off recent spending, automatic calculation of how a user is spending based off of their needs/wants and their paycheck. Created persistent user storage through localstorage. CSS styling changes for login and details pages. Reorganized code for a more consistent site experience. Wrote contribution summary. General bugfixes.

Christian Lane - Added recent transactions table. Added user login and log out functionality that hides the main page when logged out. Created an add transaction modal. Reorganized the JSON structure so every user has their own blob. Recorded video. General bugfixes.

Jeffrey Perdue - Added additional details page for transactions. Added the ability to add and delete transactions. Added pagination for recent transactions. Wrote the README.
