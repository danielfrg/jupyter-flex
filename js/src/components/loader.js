// This is copied from Voila JS

/**
 * Load a package using requirejs and return a promise
 *
 * @param pkg Package name or names to load
 */
export function requirePromise(pkg) {
    return new Promise((resolve, reject) => {
        let require = window.requirejs;
        if (require === undefined) {
            reject(
                "Requirejs is needed, please ensure it is loaded on the page."
            );
        } else {
            require(pkg, resolve, reject);
        }
    });
}
