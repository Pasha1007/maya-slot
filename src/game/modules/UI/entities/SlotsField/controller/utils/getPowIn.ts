export const  getPowIn = function(pow: number) {
    return function(t: number) {
        return Math.pow(t,pow);
    };
}