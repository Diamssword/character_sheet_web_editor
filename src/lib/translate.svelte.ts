var dictionnary:App.Locals["dictionnary"];
export function create(dic:App.Locals["dictionnary"])
{
    dictionnary=dic;
}
export default function tr(name:string,...params:any)
{
    if(dictionnary)
    {
        var translate=dictionnary[name];
        if(translate)
        {
                return formatter(translate,...params)
        }
    }
    return name;

}

/**
 * Formats a string using printf‑style placeholders.
 *
 * Supported specifiers:
 *   %s – string
 *   %d or %i – integer (base‑10)
 *   %f – floating‑point number
 *   %o – object (JSON‑stringified)
 *
 * @param {string} fmt   The format string containing placeholders.
 * @param {...any} args  Values to substitute into the placeholders.
 * @returns {string}      The formatted string.
 */
function formatter(fmt:string, ...args:any) {
    let argIdx = 0;                     // tracks which argument to consume next

    // Replace each placeholder with the corresponding argument
    const result = fmt.replace(/%[sdifo]/g, placeholder => {
        // If we run out of arguments, leave the placeholder untouched
        if (argIdx >= args.length) {
            console.warn('sprintf: not enough arguments for format string');
            return placeholder;
        }

        const val = args[argIdx++];
        switch (placeholder) {
            case '%s':               // string
                return String(val);
            case '%d':
            case '%i':               // integer
                return Number.parseInt(val, 10).toString();
            case '%f':               // floating point
                return Number(val).toString();
            case '%o':               // object – pretty‑print as JSON
                try {
                    return JSON.stringify(val);
                } catch (_) {
                    return String(val);
                }
            default:
                // Should never hit because of the regex, but keep safe
                return placeholder;
        }
    });

    // If there are leftover arguments they are simply ignored.
    return result;
}
