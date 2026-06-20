/**

* Generate a greeting based on the current server time.
*
* Used to provide a simple time-of-day message in templates.
*
* Returns:
* * "Good Morning!" before 12:00
* * "Good Afternoon!" between 12:00 and 17:59
* * "Good Evening!" after 18:00
    */
    const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

  if (currentHour < 12) {
  return 'Good Morning!';
  }

  if (currentHour < 18) {
  return 'Good Afternoon!';
  }

  return 'Good Evening!';
  };

/**

* Initialize dynamic head asset functionality for EJS templates.
*
* Allows routes and middleware to inject page-specific assets, such as
* stylesheets, without modifying the shared header partial.
*
* LEGACY: Preserved while the application's styling system is rebuilt.
  */
  const setHeadAssetsFunctionality = (res) => {
  res.locals.styles = [];

  /**

  * Register a page-specific style reference.
    */
    res.addStyle = (style) => {
    res.locals.styles.push(style);
    };

  /**

  * Render all registered styles for inclusion in the page head.
    */
    res.locals.renderStyles = () => {
    return res.locals.styles.join("\n");
    };
    };

/**

* Populate res.locals with values shared across all templates.
*
* Available template variables:
* * isLoggedIn
* * currentYear
* * NODE_ENV
* * queryParams
* * greeting
* * bodyClass
* * renderStyles()
    */
    const addLocalVariables = (req, res, next) => {

  /**

  * Expose authentication state to templates for conditional navigation
  * and page content.
    */
    res.locals.isLoggedIn = false;

  if (req.session && req.session.user) {
  res.locals.isLoggedIn = true;
  }

  /**

  * Enable page-specific asset injection.
    */
    setHeadAssetsFunctionality(res);

  /**

  * Current year used by shared templates such as the site footer.
    */
    res.locals.currentYear = new Date().getFullYear();

  /**

  * Current application environment.
    */
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

  /**

  * Make query parameters available to all templates.
    */
    res.locals.queryParams = { ...req.query };

  /**

  * Greeting displayed based on the current server time.
    */
    res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;

  /**

  * LEGACY: Random theme selection from the original project.
  * Preserved as a reference while the application's visual design
  * is being rebuilt.
    */
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

  /**

  * Continue processing the request.
    */
    next();
    };

export { addLocalVariables };
