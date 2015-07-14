rubricsModule.factory('RubricsFactory', function(database, config) {
    var getAll = function() {
        return database.getTableRecords(config.tableNames.rubrics);            
    };

    return {
        getAll: getAll
    };
})