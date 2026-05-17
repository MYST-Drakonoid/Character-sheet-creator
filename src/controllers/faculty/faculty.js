import {
    getAllFaculty,
    getFacultyById,
    getSortedFaculty
} from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyPage = (req, res) => {
    const sortBy = req.query.sort || 'name';
    const faculty = getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty',
        faculty,
        currentSort: sortBy
    });
};

// Route handler for individual faculty detail pages
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);

    // If faculty member does not exist, create a 404 error
    if (!faculty) {
        const err = new Error(`${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty-detail', {
        // Browser/page title
        title: `${faculty.name} - ${faculty.department}`,

        // Pass the full faculty object to the EJS template
        faculty,

        // Pass the department separately for convenience
        department: faculty.department
    });
};

export { facultyPage, facultyDetailPage };