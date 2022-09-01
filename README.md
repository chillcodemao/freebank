# freebank
// Banking app for mobile


**Description**
- create minimalist banking app UI for mobile, using common mobile resolution 375x667 px
- create 2 user account objects to simulate receiving JSON data from web API

Account 1:
- username: am
- password: 1111

Account 2:
- username: mm
- password: 2222

- each account receives the following hard-coded 'web data' keys : owner, pin, transactions array, transaction dates, locale, interest rate, currency
- for each account the balance will be calculated and added to the account object
- for each account the username will be computed and added to the account object


**Scope:**
- implement simplified login, logout and incorrect login functionality
- compute and display language-country specific formatted balance, currency, dates
- create and manipulate transactions, summary, transactions history
- implement Transfer Money functionality
- implement Request Loan functionality
- implement a logout countdown timer (reset by transfer money or request loan activity)


**Functionality & Rules**

**1. Login Screen**
- username defined, no validation implemented, use hard-coded 'am' or 'mm'
- simple password validation implemented with error message alert
- cannot login by pressing 'Enter' in the form, use login button

**2. Dashboard Screen**
- custom welcome message with account owner's first name
- logout button - hides dashboard and shows login screen

- balance section: sum calculated, number and date formatting based on account locale

- transactions section: transaction history list with number and date formatting + currency formatting based on locale
- sort button for transaction list
- calc money in, money out and interest rate on deposits and display in summary section under transaction history list

- transfer money section: can send funds between the 2 accounts (positive sums and not greater than current balance value)

- request a loan section: if requested sum does not exceed 30% of the current account balance, the loan will be apporved and deposit will be visible after a timeout

**3. Timers**
- logout timer: 5 minutes until auto logout
- logout timer resets when doing successful money tranfers or by being granted a loan
- time delay between login screen and dashboard screen
- time delay before being granted loan
- time delay before processing tranaction

**4. Misc**
- text editor used: VS Code
- design files created and used: initia sketch, figma file and pdf file exported
- flowchart created to map process steps
- Freebank logo is an original image file created for this project through OpenAI's DALL-E image processing AI
- colors and design direction for the UI was inspired by the colors and look of the logo
- image files resized for faster load times
- css files split into 3 parts: 1 for style reset, 2 for setting colors and fonts and the 3rd for the rest of the styling
- Nunito Sans google font used
