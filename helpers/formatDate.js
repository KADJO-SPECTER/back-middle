const { format } = require('date-fns');

// Fonction pour formater la date
function formatDate(date) {
  return format(date, 'dd/MM/yyyy');
}


module.exports = formatDate;