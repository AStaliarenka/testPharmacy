/* eslint-disable @typescript-eslint/no-explicit-any */
function debounce(func: any, ms: number) {
    let timeout: NodeJS.Timeout;
    return function(...args: any) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), ms);
    };
}

export default debounce
