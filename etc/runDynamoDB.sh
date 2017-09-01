#!/bin/bash
cd ./build/dynamodb/
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory
cd ../..
