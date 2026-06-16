import {
    getFacultyById,
    getFacultyBySlug,
    getSortedFaculty
} from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyPage = async (req, res) => {
    const sortBy = req.query.sort || 'name';
    const faculty = await getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty',
        faculty,
        currentSort: sortBy
    });
};

// Route handler for individual faculty detail pages
const facultyDetailPage = async (req, res, next) => {
    const facultyId = req.params.facultyId;

    let faculty = await getFacultyById(facultyId);

    if (!faculty || Object.keys(faculty).length === 0) {
        faculty = await getFacultyBySlug(facultyId);
    }

    if (!faculty || Object.keys(faculty).length === 0) {
        const err = new Error(`${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: `${faculty.name} - ${faculty.department}`,
        faculty,
        department: faculty.department
    });
};

export { facultyPage, facultyDetailPage };