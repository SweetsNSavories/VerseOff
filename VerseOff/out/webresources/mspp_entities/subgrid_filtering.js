var mspp;
(function (mspp) {
    var subgrid_filtering;
    (function (subgrid_filtering) {
        /**
         * Gets the Sub-grid's name base on the entity's name.
         * @param {string} entityName entity logical name.
         * @returns Name of the Sub-grid
         */
        function getSubgridBasedOnEntity(entityName) {
            switch (entityName) {
                case 'adx_ad':
                    return 'grid_powerpagecomponent_adplacement';
                case 'adx_poll':
                    return 'grid_powerpagecomponent_pollplacements';
                case 'adx_invitation':
                    return 'PowerPageComponent_AssignToWebRoles';
                case 'adx_communityforumaccesspermission':
                    return 'grid_adx_communityforumaccesspermission_mspp_webrole';
                case 'contact':
                    return 'grid_contact_mspp_webrole';
                case 'mspp_webform':
                    return 'grid_webformsessions';
                case 'mspp_adplacement':
                    return 'grid_ads';
                case 'mspp_pollplacement':
                    return 'grid_polls';
            }
        }

        /**
         * Gets the relationship's name based on the Sub-grid's name.
         * @param {string} subgridName Sub-grid's name.
         * @returns Relationship's logical name.
         */
        function getRelationshipBasedOnSubgrid(subgridName) {
            switch (subgridName) {
                case 'grid_powerpagecomponent_adplacement':
                    return 'powerpagecomponent_mspp_adplacement_adx_ad';
                case 'grid_powerpagecomponent_pollplacements':
                    return 'powerpagecomponent_mspp_pollplacement_adx_poll';
                case 'PowerPageComponent_AssignToWebRoles':
                    return 'adx_invitation_mspp_webrole_powerpagecomponent';
                case 'grid_adx_communityforumaccesspermission_mspp_webrole':
                    return 'adx_communityforumaccesspermission_powerpagecomponent_WebRole';
                case 'grid_contact_mspp_webrole':
                    return 'powerpagecomponent_mspp_webrole_contact';
                case 'grid_webformsessions':
                    return 'powerpagecomponent_mspp_webformid_adx_webformsession';
                case 'grid_ads':
                    return 'powerpagecomponent_mspp_adplacement_adx_ad';
                case 'grid_polls':
                    return 'powerpagecomponent_mspp_pollplacement_adx_poll';
            }
        }

        /**
         * Gets the core entity's name based on the virtual entity name.
         * @param {string} virtualEntityName Logical name of the virtual entity.
         * @returns Power Pages core entity's name.
         */
        function getCoreEntityName(virtualEntityName) {
            switch (virtualEntityName) {
                case 'mspp_website':
                    return 'powerpagesite';
                case 'mspp_websitelanguage':
                    return 'powerpagesitelanguage';
                default:
                    return 'powerpagecomponent';
            }
        }

        /**
         * Refreshes the Sub-grid.
         * @param {object} formContext current form's context
         */
        function refreshSubgrid(formContext) {
            let formType = formContext.ui.getFormType();

            let formEntityName = formContext.data.entity.getEntityName();
            let subgridName = getSubgridBasedOnEntity(formEntityName);
            let gridContext = formContext.getControl(subgridName);
            formEntityName = formEntityName.startsWith("mspp_") ? getCoreEntityName(formEntityName) : formEntityName;

            if (formType === 0 || formType === 1) {
                gridContext.setVisible(false);
                return;
            }
            
            if (!gridContext.getVisible()) {
                gridContext.setVisible(true);
            }

            let recordId = formContext.data.entity.getId().slice(1,-1);

            let gridEntityName = gridContext.getEntityName();
            let actualGridEntityName = gridEntityName.startsWith("mspp_") ? getCoreEntityName(gridEntityName) : gridEntityName;
            let relationship = getRelationshipBasedOnSubgrid(subgridName);
            
            Xrm.WebApi.retrieveRecord(formEntityName, recordId, `?$expand=${relationship}($select=${actualGridEntityName}id)`).then(
                function (result) {
                    let fetchXmlBuilder = '';
                    if (result?.[relationship]?.length > 0) {
                        result[relationship].forEach(function (associatedRecord) {
                            fetchXmlBuilder += `\t\t<value>${associatedRecord[`${actualGridEntityName}id`]}</value>\n`;
                        });
                        fetchXmlBuilder = 
                        `<filter>\n`+
                            `\t<condition attribute="${gridEntityName}id" operator="in">\n` +
                                `${fetchXmlBuilder}` +
                            `\t</condition>\n` +
                        `</filter>`;
                    } else {
                        fetchXmlBuilder += 
                        `<filter>\n`+
                            `\t<condition attribute="${gridEntityName}id" operator="null" />\n` +
                        `</filter>`;
                    }
                    gridContext.setFilterXml(fetchXmlBuilder);
                    gridContext.refresh();
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        function filterAssociatedRecords(executionContext) {
            let formContext = executionContext.getFormContext();
            refreshSubgrid(formContext);
        }

        subgrid_filtering.filterAssociatedRecords = filterAssociatedRecords;
        subgrid_filtering.refreshSubgrid = refreshSubgrid;
    })(subgrid_filtering = mspp.subgrid_filtering || (mspp.subgrid_filtering = {}));
})(mspp || (mspp = {}));