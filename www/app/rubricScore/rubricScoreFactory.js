rubricScoreModule.factory('RubricScoreFactory', function(database, config, $q) {    
    var get = function(id) {
        var query = 'SELECT * FROM ' + config.tableNames.rubricScores +  ' WHERE id = ?';
        return database.executeSql(query, [id], true);            
    };

    var insert = function(rubricLineId, rubricScore) {
        var deferred = $q.defer();
    	var query = 'INSERT INTO ' + config.tableNames.rubricScores + 
    		'(type, description, review, feedback) VALUES (?, ?, ?, ?)';    		

    	database.executeSql(query, [rubricScore.type, rubricScore.description, rubricScore.review, rubricScore.feedback], true).then(
            function(data) {
                var query = 'INSERT INTO ' + config.tableNames.rubricLineScores + 
                    '(fk_rubric_line, fk_rubric_score) VALUES (?, ?)';        
                database.executeSql(query, [rubricLineId, data.insertId], true).then(
                    function(data) {
                        deferred.resolve();
                    },
                    function(error) {
                        deferred.reject(error);
                    });
            },
            function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var update = function(rubricScore) {        
    	var query = 'UPDATE ' + config.tableNames.rubricScores + 
    		' SET description = ?, review = ?, feedback = ?' + 
    		' WHERE id = ?';

    	return database.executeSql(query, [rubricScore.description, rubricScore.review, rubricScore.feedback, rubricScore.id]);
    };

    return {
        get: get,
        insert: insert,
        update: update
    };
})