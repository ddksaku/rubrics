app.value('config', {
    baseUrl: 'http://rubrics.education/',
    // baseUrl: 'http://localhost:88/',
    servicePaths: {
        login: 'login.php',
        signup: 'register.php',
       	getTables: 'info_get.php',
       	putTables: 'info_put.php'
    },
    serviceStatuses: {
        success: 200
    },
    tableNames: {
    	user: 'user',
    	settings: 'settings',
        rubrics: 'rubrics',
        classes: 'classes',
        students: 'students',
        rubricClasses: 'rubric_classes',
        rubricLines: 'rubric_lines',
        rubricScores: 'rubric_scores',
        rubricLineScores: 'rubric_line_scores',
        rubricScoreFiles: 'rubric_score_files',
        files: 'files'
    }
});