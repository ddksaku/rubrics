rubricLinesModule.factory('RubricLinesFactory', function(config, database) {    
    var gets = function(rubricId, studentId) {
        var query = 'SELECT rs.*, rl.id rubric_line_id FROM ' + config.tableNames.rubricLines + 
            ' rl INNER JOIN ' + config.tableNames.rubricLineScores + 
            ' rls ON rl.id = rls.fk_rubric_line' +
            ' INNER JOIN ' + config.tableNames.rubricScores + 
            ' rs ON rs.id = rls.fk_rubric_score' +
            ' WHERE rl.fk_rubric = ? AND rl.fk_student = ? ' +
            ' ORDER BY rubric_line_id';
        return database.executeSql(query, [rubricId, studentId]);
    };    

    return {
        gets: gets
    };
});
