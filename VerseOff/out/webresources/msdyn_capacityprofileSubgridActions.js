var OCBaseURBase;
(function (OCBaseURBase) {
    var ResourceStringProvider = (function () {
        function ResourceStringProvider() {
        }
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            if (value === undefined || value === null) {
                value = key;
            }
            return value;
        };
        ResourceStringProvider.WebResourceName = "msdyn_Localization/Languages/OCBaseURBase";
        return ResourceStringProvider;
    }());
    OCBaseURBase.ResourceStringProvider = ResourceStringProvider;
})(OCBaseURBase || (OCBaseURBase = {}));
var OCBaseURBase;
(function (OCBaseURBase) {
    var StringProvider = (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return OCBaseURBase.ResourceStringProvider ? OCBaseURBase.ResourceStringProvider.getResourceString(key) : "*" + key + "*";
        };
        return StringProvider;
    }());
    OCBaseURBase.StringProvider = StringProvider;
})(OCBaseURBase || (OCBaseURBase = {}));
var OCBaseURBase;
(function (OCBaseURBase) {
    var msdyn_capacityProfileSubgridActions = (function () {
        function msdyn_capacityProfileSubgridActions() {
        }
        msdyn_capacityProfileSubgridActions.hideAndFilterSubgridOnLoad = function (context) {
            var formContext = context.getFormContext();
            if (formContext == null) {
                return;
            }
            var capacityProfileSubgrid = formContext.getControl(msdyn_capacityProfileSubgridActions.capacityProfileSubgrid);
            if (capacityProfileSubgrid == null) {
                return;
            }
            var omnichannelTab = formContext.ui.tabs.get(msdyn_capacityProfileSubgridActions.omnichannelTabName);
            if (omnichannelTab == null) {
                return;
            }
            var capacityProfileSection = omnichannelTab.sections.get(msdyn_capacityProfileSubgridActions.capacityProfileSectionName);
            if (capacityProfileSection == null) {
                return;
            }
            var userId = msdyn_capacityProfileSubgridActions.getGuid(formContext.data.entity.getId());
            msdyn_capacityProfileSubgridActions.getAssociatedBookableResource(userId).then(function (response) {
                if (response) {
                    msdyn_capacityProfileSubgridActions.AddFetchForSubgrid(capacityProfileSubgrid, userId);
                    capacityProfileSection.setVisible(true);
                }
                else {
                    capacityProfileSection.setVisible(false);
                }
            }, function (err) {
            });
        };
        msdyn_capacityProfileSubgridActions.AddFetchForSubgrid = function (capacityProfileSubgridControl, systemUserId) {
            var filterToAdd = "<filter type=\"and\">\n                <condition entityname=\"ac\" attribute=\"systemuserid\" operator=\"eq\" value=\"{" + systemUserId + "}\"  /> \n                <filter>";
            capacityProfileSubgridControl.setFilterXml(filterToAdd);
            capacityProfileSubgridControl.refresh();
        };
        msdyn_capacityProfileSubgridActions.omnichannelTabName = "Omnichannel_TAB";
        msdyn_capacityProfileSubgridActions.capacityProfileSectionName = "tab_6_section_4";
        msdyn_capacityProfileSubgridActions.systemUserLogicalName = "systemuser";
        msdyn_capacityProfileSubgridActions.capacityProfileLogicalName = "msdyn_capacityprofile";
        msdyn_capacityProfileSubgridActions.bookableResourceCapacityProfileLogicalName = "msdyn_bookableresourcecapacityprofile";
        msdyn_capacityProfileSubgridActions.bookableResourceAliasAndId = "BookableResource.bookableresourceid";
        msdyn_capacityProfileSubgridActions.noBookableResourceText = "noBookableResourceText";
        msdyn_capacityProfileSubgridActions.capacityProfileNotAssociatedText = "capacityProfileNotAdded";
        msdyn_capacityProfileSubgridActions.capacityProfileNotDissociatedText = "capacityProfileNotRemoved";
        msdyn_capacityProfileSubgridActions.capacityProfileSubgrid = "CapacityProfilesSubgrid";
        msdyn_capacityProfileSubgridActions.getGuid = function (id) {
            return id.replace(/[{}]/g, "");
        };
        msdyn_capacityProfileSubgridActions.fetchUserHasBookableResource = function (systemUserId) {
            return "<fetch distinct=\"true\" useraworderby=\"false\" no-lock=\"false\" mapping=\"logical\">\n                <entity name=\"systemuser\" >\n                <filter type=\"and\" >\n                    <condition attribute=\"systemuserid\" operator=\"eq\" value=\"{" + systemUserId + "}\" />\n                </filter>\n                <link-entity name=\"bookableresource\" from=\"userid\" to=\"systemuserid\" alias=\"BookableResource\" >\n                    <attribute name=\"bookableresourceid\" />\n                </link-entity>\n                </entity>\n            </fetch>";
        };
        msdyn_capacityProfileSubgridActions.getAssociatedBookableResource = function (systemUserId) {
            return Xrm.WebApi.retrieveMultipleRecords(msdyn_capacityProfileSubgridActions.systemUserLogicalName, "?fetchXml=" + encodeURIComponent(msdyn_capacityProfileSubgridActions.fetchUserHasBookableResource(systemUserId)))
                .then(function (response) {
                if (response && response.entities && response.entities.length > 0) {
                    return msdyn_capacityProfileSubgridActions.getGuid(response.entities[0][msdyn_capacityProfileSubgridActions.bookableResourceAliasAndId]);
                }
                else {
                    return null;
                }
            }, function (error) {
            });
        };
        msdyn_capacityProfileSubgridActions.createAssociatedRecords = function (primaryEntity, selectedControl) {
            var primaryEntityId = msdyn_capacityProfileSubgridActions.getGuid(primaryEntity[0]);
            Xrm.Utility.lookupObjects({
                entityTypes: [msdyn_capacityProfileSubgridActions.capacityProfileLogicalName],
                allowMultiSelect: true,
            }).then(function (response) {
                if (response && response.length > 0) {
                    response.forEach(function (r) {
                        var capacityProfileId = msdyn_capacityProfileSubgridActions.getGuid(r.id);
                        msdyn_capacityProfileSubgridActions.getAssociatedBookableResource(primaryEntityId).then(function (bookableResourceResponseId) {
                            if (bookableResourceResponseId) {
                                var entity = {};
                                entity["msdyn_bookableresourceid@odata.bind"] = "/bookableresources(" + bookableResourceResponseId + ")";
                                entity["msdyn_capacityprofileid@odata.bind"] = "/msdyn_capacityprofiles(" + capacityProfileId + ")";
                                Xrm.WebApi.createRecord(msdyn_capacityProfileSubgridActions.bookableResourceCapacityProfileLogicalName, entity).then(function success(result) {
                                    selectedControl.refresh();
                                }, function (error) {
                                    Xrm.Utility.alertDialog(OCBaseURBase.StringProvider.getResourceString(msdyn_capacityProfileSubgridActions.capacityProfileNotAssociatedText), null);
                                })
                                    .catch(function (err) {
                                });
                            }
                            else {
                                Xrm.Utility.alertDialog({
                                    message: OCBaseURBase.StringProvider.getResourceString(msdyn_capacityProfileSubgridActions.noBookableResourceText),
                                });
                            }
                        }, function (err) {
                        });
                    });
                }
            }, function (error) {
            });
        };
        msdyn_capacityProfileSubgridActions.getAssociatedBookableResourceCapacityProfiles = function (bookableResourceId, capacityProfile) {
            return Xrm.WebApi.retrieveMultipleRecords(msdyn_capacityProfileSubgridActions.bookableResourceCapacityProfileLogicalName, "?fetchXml=" + encodeURIComponent(msdyn_capacityProfileSubgridActions.fetchUserHasBookableResourceCapacityProfiles(bookableResourceId, capacityProfile)))
                .then(function (response) {
                if (response && response.entities && response.entities.length > 0) {
                    return msdyn_capacityProfileSubgridActions.getGuid(response.entities[0]["msdyn_bookableresourcecapacityprofileid"]);
                }
                else {
                    return null;
                }
            }, function (error) {
                console.log("Error while retrieving the Bookable Resource Capacity Profile entity record");
            });
        };
        msdyn_capacityProfileSubgridActions.fetchUserHasBookableResourceCapacityProfiles = function (bookableResourceId, capacityProfile) {
            return "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\">\n              <entity name=\"msdyn_bookableresourcecapacityprofile\">\n                <attribute name=\"msdyn_bookableresourcecapacityprofileid\"/>\n                <attribute name=\"msdyn_name\"/>\n                <attribute name=\"createdon\"/>\n                <order attribute=\"msdyn_name\" descending=\"false\"/>\n                <filter type=\"and\">\n                  <condition attribute=\"msdyn_bookableresourceid\" operator=\"eq\" uiname=\"a\" uitype=\"bookableresource\" value=\"{" + bookableResourceId + "}\"/>\n                </filter>\n                <filter type=\"and\">\n                  <condition attribute=\"msdyn_capacityprofileid\" operator=\"eq\" uiname=\"a\" uitype=\"bookableresource\" value=\"{" + capacityProfile + "}\"/>\n                </filter>\n              </entity>\n            </fetch>";
        };
        msdyn_capacityProfileSubgridActions.dissociateRecords = function (primaryEntity, selectedEntityTypeName, selectedControl, firstSelectedId) {
            var primaryEntityId = msdyn_capacityProfileSubgridActions.getGuid(primaryEntity[0]);
            var rows_1 = selectedControl && selectedControl.getGrid && selectedControl.getGrid() && selectedControl.getGrid().getSelectedRows && selectedControl.getGrid().getSelectedRows();
            if (rows_1 && 0 < rows_1.getLength()) {
                rows_1.forEach(function (row) {
                    var capacityProfileId = msdyn_capacityProfileSubgridActions.getGuid(row && row.data && row.data.entity && row.data.entity.getId ? row.data.entity.getId() : null);
                    msdyn_capacityProfileSubgridActions.getAssociatedBookableResource(primaryEntityId).then(function (bookableResourceResponseId) {
                        if (bookableResourceResponseId) {
                            msdyn_capacityProfileSubgridActions.getAssociatedBookableResourceCapacityProfiles(bookableResourceResponseId, capacityProfileId).then(function (bookableresourcecapacityprofilesId) {
                                Xrm.WebApi.deleteRecord(msdyn_capacityProfileSubgridActions.bookableResourceCapacityProfileLogicalName, bookableresourcecapacityprofilesId).then(function success(result) {
                                    selectedControl.refresh();
                                }, function (error) {
                                    Xrm.Utility.alertDialog(error.message, null);
                                })
                                    .catch(function (err) {
                                    console.log("Error while removing the capacity profile");
                                });
                            });
                        }
                        else {
                            Xrm.Utility.alertDialog({
                                message: OCBaseURBase.StringProvider.getResourceString(msdyn_capacityProfileSubgridActions.noBookableResourceText),
                            });
                        }
                    });
                });
            }
        };
        return msdyn_capacityProfileSubgridActions;
    }());
    OCBaseURBase.msdyn_capacityProfileSubgridActions = msdyn_capacityProfileSubgridActions;
})(OCBaseURBase || (OCBaseURBase = {}));
