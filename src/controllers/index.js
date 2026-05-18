// Route handlers for static pages

// Home page
const homePage = (req, res) => {
    res.render('home', {
        title: 'Welcome Home'
    });
};

// About page
const aboutPage = (req, res) => {
    res.render('about', {
        title: 'About Me'
    });
};

// Products page
const productsPage = (req, res) => {
    res.render('products', {
        title: 'Our Products'
    });
};

// Demo page
const demoPage = (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
};

// Route used to intentionally trigger a 500 error for testing
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

// Export all controllers
export {
    homePage,
    aboutPage,
    productsPage,
    demoPage,
    testErrorPage
};