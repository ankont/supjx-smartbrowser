(() => {
  const fieldset = document.getElementById('fieldset-associations');
  if (!fieldset || !window.Joomla?.showAssociationMessage || !window.Joomla?.hideAssociation) return;

  const clearMessage = () => fieldset.querySelectorAll('joomla-alert').forEach((alert) => alert.remove());
  const showMessage = Joomla.showAssociationMessage;
  const hideAssociation = Joomla.hideAssociation;

  Joomla.showAssociationMessage = (...args) => {
    clearMessage();
    showMessage(...args);
  };
  Joomla.hideAssociation = (...args) => {
    clearMessage();
    hideAssociation(...args);
  };
})();
