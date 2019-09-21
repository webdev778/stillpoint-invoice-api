# StillPointSpace-Invoice-App Production

[StillPointSpace-Invoice-App](https://stillpointspaces-invoicing.netlify.com/) production site

## Development Environment Setup

### Tools Required

* [Git](https://git-scm.com/)
* [NodeJS](https://nodejs.org/en/) - version 10.x LTS (the latest 10.x LTS available known as `lts/carbon`)
	* It is recommended to use [`nvm`](https://github.com/creationix/nvm) to manage your NodeJS installation and versions.  If you are not on a *nix based environment, and are required to develop in a Windows environment [`nvm-windows`](https://github.com/coreybutler/nvm-windows) is a good alternative.
* [PostgreSQL](https://www.postgresql.org/download/) - version 7.x is currently used

### Setup with Homebrew ###
If you are developing on Mac OS X, we recommend installing the required tools with [Homebrew](https://brew.sh/) by running:
* `brew install git`
* `brew install nvm`
* `brew install postgresql`

Run `brew services start postgresql` to start postgresql after install.

### First Time Environment Setup

1. Clone repository:

    $ git clone git@github.com:stillpointspaces-invoice/production.git

1. Install node package dependencies:

	$ npm ci

	- Note we prefer [`npm ci`](https://docs.npmjs.com/cli/ci.html) over `npm install` as it is more strict about following the `package-lock.json` file and also is quicker.

1. Configure dotenv file

    - Create the `.env` file using the template:
      * $ `cp .env.template .env`
    - Edit the `.env` file with your appropriate ENV variable options:
      * $ `vim .env`
    - Minimally required ENV keys that need to be defined to run locally include the following:
      * DB_HOST, DB_NAME, DB_PORT
      * SERVER_HOST, SERVER_PORT
    - In development, you can comment out the `DB_USER` and `DB_PASS` if your local PostgreSQL instance doesnt require user auth

### DB migration in PostgreSQL  
1. db migration  
  $ npm run db:migrate
  
2. restore migration  
  $ npm run db:restore

### Daily Development Process

1. Start the server  

	$ npm run start

1. View the development environment website at [`http://localhost:3001`](http://localhost:3001)

