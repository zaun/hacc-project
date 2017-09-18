# EAL Surfer

The EAL Surfer is now on the web

# Production

Visit http://eal.services/

# Local Development

The project is built on top of Amazon AWS cloud services.  The project is built entirely upon javascript - the back-end using node.js (on AWS Lambda) and the front-end using the Vue.js framework.

1. Setup development environment (OSX)

   * Install Brew
     > /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   * Install n
     > brew install n
   * Install node
     > sudo n v6.10
   * Install Java
     > http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

1. Install the development tools globally

   * npm install -g gulp

1. Building the server

   * npm install
   * gulp
     * gulp buildServer

1. Run a local version of the server

   * Download dynamodb
     * gulp getDynamoDB
   * In one terminal run the database
     * ./etc/runDynamoDB.sh
   * In a second terminal run the API server
     * ./etc/runAPI.sh

1. Run local version of the web

   * npm run dev OR ./etc/runWeb.sh

1. Package for AWS Deployment

   * NODE_ENV=production gulp dist
   * npm run build
   * Run the cloud formation in ./dist
   * Upload the zip to the new lambda function
   * Upload the client files in dist to the s3 bucket
   * Goto the /#update to import the csv data files

# Notes

  * For production, during the import process to AWS DynamoDB, table write throughput needs to be bumped up to about 40. It can be set back to 1 after the import.
  * The HEER office provided many tables and lots of information but they are not all currently used.