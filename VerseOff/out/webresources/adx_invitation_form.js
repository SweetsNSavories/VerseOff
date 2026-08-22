var maximumRedemptionsInitialValue;

function initialize() {
	// if form is create mode, then generate a invitation code
	if (Xrm.Page.ui.getFormType() == 1) {
		var invitationCodeAttribute = Xrm.Page.getAttribute("adx_invitationcode");

		// Remove the auto-populated redeemed contact and inviter when an invitation is created from a contact.
		// This needs to be done because the system attribute mappings cannot be deleted.
		if (Xrm.Page.getAttribute("adx_redeemedcontact").getValue() != null) {
			Xrm.Page.getAttribute("adx_redeemedcontact").setValue(null);
		}
		if (Xrm.Page.getAttribute("adx_invitercontact").getValue() != null) {
			Xrm.Page.getAttribute("adx_invitercontact").setValue(null);
		}
	}

	// if status is not new, then set type as readonly
	if (Xrm.Page.getAttribute("statuscode").getValue() != 1) {
		Xrm.Page.getControl("adx_type").setDisabled(true);
	}

	maximumRedemptionsInitialValue = Xrm.Page.getAttribute("adx_maximumredemptions").getValue();

	toggleVisibleSections();
}

function toggleVisibleSections() {
	var generalTab = Xrm.Page.ui.tabs.get("invitation_general_tab");
	var inviteeSection = generalTab.sections.get("invitee_section");
	var inviteesSection = generalTab.sections.get("invitees_section");
	var redemptionSection = generalTab.sections.get("redemption_section");
	var redemptionsSection = generalTab.sections.get("redemptions_section");

	var typeSingle = 756150000;
	var typeGroup = 756150001;
	var invitationType = Xrm.Page.getAttribute("adx_type").getValue();

	var maxRedemptionsAttribute = Xrm.Page.getAttribute("adx_maximumredemptions");

	if (invitationType == typeSingle) {
		inviteeSection.setVisible(true);
		inviteesSection.setVisible(false);
		redemptionSection.setVisible(true);
		redemptionsSection.setVisible(false);

		maximumRedemptionsInitialValue = maxRedemptionsAttribute.getValue();
		maxRedemptionsAttribute.setValue(1);
	}
	else if (invitationType == typeGroup) {
		inviteeSection.setVisible(false);
		inviteesSection.setVisible(true);
		redemptionSection.setVisible(false);
		redemptionsSection.setVisible(true);

		maxRedemptionsAttribute.setValue(maximumRedemptionsInitialValue);
	}
}

function openNewInvitationFromContactForm() {
	var contactId = Xrm.Page.data.entity.getId();
	var contactName = Xrm.Page.data.entity.getPrimaryAttributeValue();

	var parameters = {};
	parameters["adx_name"] = contactName;
	parameters["adx_type"] = 756150000;
	parameters["adx_invitecontact"] = contactId;
	parameters["adx_invitecontactname"] = contactName;

	Xrm.Utility.openEntityForm("adx_invitation", null, parameters);
}

function openNewInvitationForm(contactReferences) {
	var contactId = contactReferences[0].Id;
	var contactName = contactReferences[0].Name;

	var parameters = {};
	parameters["adx_name"] = contactName;
	parameters["adx_type"] = 756150000;
	parameters["adx_invitecontact"] = contactId;
	parameters["adx_invitecontactname"] = contactName;

	Xrm.Utility.openEntityForm("adx_invitation", null, parameters);
}
