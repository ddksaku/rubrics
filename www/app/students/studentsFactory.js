studentsModule.factory('StudentsFactory', function(config, database) {
    var gets = function(classId) {
        var query = 'SELECT * FROM ' + config.tableNames.students +  ' WHERE fk_class = ?';
        return database.executeSql(query, [classId]);            
    };

    return {
        gets: gets
    };
})