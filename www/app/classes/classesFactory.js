classesModule.factory('ClassesFactory', function(config, database) {
    var gets = function(rubricId) {
        var query = 'SELECT c.* FROM ' + config.tableNames.classes + 
            ' c LEFT JOIN ' + config.tableNames.rubricClasses + 
            ' rc ON c.id = rc.fk_class WHERE fk_rubric = ?';
        return database.executeSql(query, [rubricId]);            
    };

    return {
        gets: gets
    };
})