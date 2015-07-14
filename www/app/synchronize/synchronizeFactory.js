synchronizeModule.factory('SynchronizeFactory', function($http, $log, $localStorage, $q, $ionicLoading, config, database) {
	var moduleName = 'SynchronizeFactory';

	var getTables = function() {
        var functionName = 'getTables';

        var deferred = $q.defer();
        $http.post(config.baseUrl + config.servicePaths.getTables, {
            username: config.user.name, 
            password: config.user.password
        })
            .success(function(data) {                            
                if (data.status == config.serviceStatuses.success) {
                    var tableList = data.data.records;
                    if (tableList == null) {
                        deferred.resolve('There is no tables to be downloaded.');                                                                                 
                    } else {                        
                        var totalTableCount = tableList.length;                        
                        var downloadedTableCount = 0;
                        
                        _.each(tableList, function(table) {
                            getTable(table.TABLE_NAME).finally(
                                function() {    
                                    $ionicLoading.show({template: 'Downladed ' + table.TABLE_NAME + ' table.'});                                                                            
                                    downloadedTableCount++;
                                    if (downloadedTableCount == totalTableCount) {                                         
                                        deferred.resolve('Successfully downloaded tables.');                                         
                                    }
                                });
                        });                                      
                    }
                } else {        
                    deferred.reject('Failed to download tables.');                                
                }                
            })
            .error(function(error) {
                deferred.reject('The web service is offline.');                                                        
            });

        return deferred.promise;
    };          

    var getTable = function(tableName) {        
        var functionName = 'getTable';
        
        var deferred = $q.defer();
        var timeStampKey = tableName + '.timeStamp'; 
        var lastUpdated = $localStorage[timeStampKey];
        if (_.isUndefined(lastUpdated) || lastUpdated == null) {
            lastUpdated = '';
        }    

        $http.post(config.baseUrl + config.servicePaths.getTables, {
            username: config.user.name, 
            password: config.user.password,
            table: tableName, 
            updated: lastUpdated
        })
            .success(function(data) {
                var tableColumns = database.convertColumns(data.design);          
                var tableRecords = data.data.records;
                var timeStamp = data.timestamp;
                                    
                if (tableColumns !== null) {
                    database.createTable(tableName, tableColumns)
                        .then(                        
                            function() {
                                if (tableRecords !== null) {                                    
                                    $log.info(moduleName, functionName, tableRecords);
                                    database.updateTableRecords(tableName, tableColumns, tableRecords).then(
                                        function(data) {
                                            $localStorage[timeStampKey] = timeStamp;                    
                                            
                                            var message = data.success + ' of ' + data.all + ' records from ' + tableName + ' table updated.';
                                            $log.info(moduleName, functionName, message);                                                           
                                            deferred.resolve();  
                                        });                                                                              
                                } else {
                                    deferred.resolve();
                                }
                            },
                            function(error) {
                                deferred.reject();
                            });                                   
                }                        
            })
            .error(function(error) {
                $log.error(moduleName, functionName, 'The web service is offline.');  
                deferred.reject();
            });
    
        return deferred.promise;
    };

    var putTables = function() {
        var functionName = 'putTables';        
        
        var deferred = $q.defer();
        database.getTableList()
            .then(
                function(tableNames) {                    
                    if (tableNames.length == 0) {
                        deferred.resolve('There is no table to upload.');                                                            
                    } else {                                                                   
                        var totalTableCount = tableNames.length;
                        var uploadedTableCount = 0;
                        
                        _.each(tableNames, function(tableName) {
                            // when uploading the information, do not upload the settings or users table
                            if (tableName == config.tableNames.user || tableName == config.tableNames.settings) {
                                uploadedTableCount++;
                                if (uploadedTableCount == totalTableCount) {
                                    deferred.resolve('Successfully uploaded tables.');                     
                                }
                            } else {
                                putTable(tableName).finally(
                                    function() {
                                        $ionicLoading.show({template: 'Uploaded ' + tableName + ' table.'});                                                                          
                                        uploadedTableCount++;                                             
                                        if (uploadedTableCount == totalTableCount) {
                                            deferred.resolve('Successfully uploaded tables.');                                          
                                        }                                                                                    
                                    });
                            }                           
                        });
                    }
                },
                function(error) {
                    deferred.reject('Failed to upload tables.'); 
                });

        return deferred.promise;            
    };
    
    var putTable = function(tableName) {
        var functionName = 'putTable';        
        
        var deferred = $q.defer();  
        database.getTableRecords(tableName)
            .then(
                function(records) {
                    var recordCount = records.length;
                    if (recordCount > 0) {
                        var columns = null; // in this version We assume local and remote databases will contain same tables.
                        
                        // We will send request by limited count of records, otherwise long request will occur problems
                        var MAX_RECORD_COUNT_PER_REQUEST = 50;
                        var startRecordIndex = 0;
                        var endRecordIndex = 0;                        
                        
                        var totalSubUpdateCount = 0;
                        var subUpdatedCount = 0;
                        while (startRecordIndex < recordCount) {                         
                            endRecordIndex = startRecordIndex + MAX_RECORD_COUNT_PER_REQUEST;
                            if (endRecordIndex > recordCount) {
                                endRecordIndex = recordCount;
                            }
                            
                            totalSubUpdateCount++;

                            var json = {
                                design: columns,            
                                data: {
                                    records: records.slice(startRecordIndex, endRecordIndex)
                                }
                            };                               
                            var json = JSON.stringify(json).replace(/\'null\'/g, 'null'); // convert 'null' to null
                                                        
                            $http.post(config.baseUrl + config.servicePaths.putTables, {
                                username: config.user.name, 
                                password: config.user.password,
                                table: tableName, 
                                json: json
                            })                            
                                .success(function(data) {            
                                    subUpdatedCount++;                                        
                                    if (subUpdatedCount == totalSubUpdateCount) {
                                        deferred.resolve();
                                    }
                                    
                                    var updatedRecordCount = data.data.count;                                    
                                    if (updatedRecordCount == null || _.isUndefined(updatedRecordCount) || updatedRecordCount == 0) {           
                                        $log.warn(moduleName, functionName, 'No record updated to ' + tableName);
                                    } else {                                        
                                        $log.info(moduleName, functionName, updatedRecordCount + ' record(s) updated to ' + tableName);                                                                                                                                                                                                                      
                                    }                                                 
                                })
                                .error(function() {
                                    subUpdatedCount++;                                        
                                    if (subUpdatedCount == totalSubUpdateCount) {
                                        deferred.reject();
                                    }
                                    
                                    $log.error(moduleName, functionName, 'The web service is offline.');                    
                                });
                            
                            startRecordIndex = endRecordIndex;
                        }
                    } else {
                        deferred.reject();
                        $log.info(moduleName, functionName, tableName + ' contains no records.');                    
                    }                    
                },
                function(error) {
                    deferred.reject();
                });     
                
        return deferred.promise;
    };

    return {
        getTables: getTables,
        getTable: getTable,
        putTables: putTables,
        putTable: putTable
    };    
});