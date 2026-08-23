var mspp;
(function (mspp) {
    var ribbon;
    (function (ribbon) {
        (function (common) {
            (function (rules) {
                function shouldPowerPagesRibbonButtonVisible() {
                    const PPMAUniqueName = 'mspp_PowerPageManagement';
                    let shouldButtonVisible = false;
                
                    return new Promise(function (resolve, reject) {
                        try {
                            let globalContext = Xrm.Utility.getGlobalContext();
                            globalContext.getCurrentAppProperties().then(
                                function (appProperties) {
                                    shouldButtonVisible = (appProperties.uniqueName == PPMAUniqueName) ? true : false;
                                    resolve(shouldButtonVisible);
                                },
                                function (error) {
                                    console.log(error.message);
                                    resolve(shouldButtonVisible);
                                }
                            );
                        }
                        catch (error) {
                            console.log(error);
                            resolve(shouldButtonVisible);
                        }
                    });
                }
    
                rules.shouldPowerPagesRibbonButtonVisible = shouldPowerPagesRibbonButtonVisible;
            })(rules = common.rules || (common.rules = {}));
        })(common = ribbon.common || (ribbon.common = {}));
    })(ribbon = mspp.ribbon || (mspp.ribbon = {}));
})(mspp || (mspp = {}));