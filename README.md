# ASE 220 Financial Planning Website Documentation

## Project Goal

The ASE 220 Financial Planning project is designed to help users manage their financial transactions effectively. It provides a platform where users can add, view, edit, and delete transactions related to their financial activities. The application aims to give users a clear overview of their spending, savings, and overall financial health, enabling better financial planning and management.

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
  - `auth.js`: Handles user authentication, including login and logout functionalities.
  - `data.js`: Manages the loading and display of transaction data from the JSONBlob API.
  - `date.js`: Contains utility functions for date manipulation.
  - `detail.js`: Manages the display and editing of individual transaction details on the `transaction-detail.html` page.
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
