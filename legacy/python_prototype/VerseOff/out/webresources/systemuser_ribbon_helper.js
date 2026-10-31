class PromoteToAdminRequest {
    constructor(userid) {
        this.entity = {
            id: userid,
            entityType: "systemuser",
        };
        this.getMetadata = function () {
            return {
                boundParameter: "entity",
                parameterTypes: {
                    entity: {
                        typeName: "Microsoft.Dynamics.CRM.systemuser",
                        structuralProperty: 5,
                    },
                },
                operationType: 0,
                operationName: "PromoteToAdmin",
            };
        };
    }
}

class RetrieveOrganizationInfoRequest {
    constructor() {
        this.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {},
                operationType: 1,
                operationName: 'RetrieveOrganizationInfo',
            };
        };
    }
}

async function promoteUserToAdmin(selectedUser) {
    const userId = selectedUser[0];
    const userSettings = Xrm.Utility.getGlobalContext().userSettings;
    let isSupportUser = false;
    let hasPrvPromoteToAdmin = false;
    let isSupportOrg = false;
    const supportUserRoleTemplateId = "2D101BB3-5CED-4122-83F1-94D5EFDE4E3B";

    const dialogstrings = {
        title: Xrm.Utility.getResourceString('systemuser', 'action.promoteToAdminDialogTitle'),
        text: Xrm.Utility.getResourceString('systemuser', 'action.promoteToAdminDialogText'),
        confirmButtonLabel: "",
        cancelButtonLabel: "",
    };
    //
    try {
        // Retrieves users roles and check if user has Support User role
        const result = await Xrm.WebApi.online.retrieveRecord(
            "systemuser",
            userSettings.userId,
            "?$select=systemuserid,fullname&$expand=systemuserroles_association"
        );
        const roles = result["systemuserroles_association"];
        isSupportUser =
            roles.find(
                (el) =>
                    el["_roletemplateid_value"] === supportUserRoleTemplateId
            ) !== undefined;
        // Retrieves the user privileges and checks if they have the prvPromoteToAdmin privilege.
        const privilegeResponse = await userSettings.getSecurityRolePrivilegesInfo();
        const promoteToAdminPrivId = "1877be10-41c1-4187-aaf4-e0c12bd11a9f";
        hasPrvPromoteToAdmin =
            privilegeResponse.hasOwnProperty(promoteToAdminPrivId);
        const orgInfoRequest = new RetrieveOrganizationInfoRequest();
        const response = await Xrm.WebApi.online.execute(orgInfoRequest);
        const orgInfo = await response.json()
        isSupportOrg = orgInfo.organizationInfo.InstanceType === "MsftInvestigation"
    } catch (error) {
        XrmCore.InternalUtilities.DialogUtilities.createActionFailedErrorDialog(error);
    }
    if ( hasPrvPromoteToAdmin && (!isSupportUser || (isSupportUser && isSupportOrg))) {
        Xrm.Navigation.openConfirmDialog(dialogstrings, null).then(
            function (result) {

                if (result.confirmed) {
                    XrmCore.InternalUtilities.GenericUtilities.showGenericProgressIndicator();
                    const request = new PromoteToAdminRequest(userId.Id);
                    Xrm.WebApi.online.execute(request).then(
                        function (result) {
                            if (result.ok) {
                                Xrm.Utility.closeProgressIndicator();
                                Xrm.Utility.refreshParentGrid({
                                    entityType: 'systemuser',
                                    id: userId.Id,
                                });
                                const notification = {
                                    type: 2, // 2 indicates a message bar at the top of the app
                                    level: 1, // 1 indicates success
                                    message: XrmCore.InternalUtilities.GenericUtilities.stringFormat(
                                        Xrm.Utility.getResourceString('systemuser', 'action.promoteToAdminSuccessMessage'),
                                        [userId.Name],
                                    ),
                                    showCloseButton: true
                                };
                                Xrm.App.addGlobalNotification(notification)
                            } else {
                                console.error("Error" + result);
                            }
                        },
                        function (error) {
                            XrmCore.InternalUtilities.DialogUtilities.createActionFailedErrorDialog(error);
                        }
                    );
                }
            }
        );
    } else {
        const errorOptions = {
            message:
                Xrm.Utility.getResourceString('systemuser', 'action.promoteToAdminDialogErrorMessage'),
        };
        Xrm.Navigation.openErrorDialog(errorOptions);
    }
}
