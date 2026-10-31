(function (global) {
    "use strict";
    global.GetGlobalContext = function () {
        if (global.__verseOffGlobalContext) {
            return global.__verseOffGlobalContext;
        }
        if (
            global.parent &&
            global.parent.__verseOffGlobalContext
        ) {
            return global.parent.__verseOffGlobalContext;
        }
        throw new Error(
            "VerseOff global context has not been injected."
        );
    };
})(window);
