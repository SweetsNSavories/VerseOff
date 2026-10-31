function emailAssistFormHandler() {
    return;
}
function hideEmailAssistCopilotButton() {
  try {
    if (!window.top.Xrm.App.sessions) {
      var event = new CustomEvent("onPageLoad_SingleSessionEmailForm", { detail: {} });
      window.top.dispatchEvent(event);
    }
  } catch (e) { }

  return true;
}
