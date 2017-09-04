# hacc-project
Our HACC Project


# Local Development

The project is built on top of Amazon AWS cloud services. The backend is using
node with the front end using the VUE javascript framework.

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

   * NODE_ENV=production gulp
   * gulp dist
   * npm run build
   * Run the cloud formation in ./dist
   * Upload the zip to the new lambda function
   * Upload the s3 files to the s3 bucket
