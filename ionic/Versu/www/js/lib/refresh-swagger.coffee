fetchSchema = require 'fetch-swagger-schema'
fs = require 'fs'
_ = require 'lodash'

basePath = "http://versu.co:3000"
# basePath = "http://localhost:8080"

apiDocs = basePath + "/docs"


fetchSchema apiDocs, (err, schema) ->
  throw err if err
  throw 'schema is empty' if _.isEmpty schema

  _.each schema.apis, (endpoint) ->
    endpoint.apiDeclaration.basePath = basePath + endpoint.apiDeclaration.basePath

  console.log 'schema', JSON.stringify schema, null, 2

  fs.writeFileSync 'versu.js', "VersuSchema = #{JSON.stringify schema};" 
