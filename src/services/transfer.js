// const ValidationError = require('../errors/ValidationError');

module.exports = app => {
  // const validate = async transfer => {
  //   if (!transfer.description) throw new ValidationError('Description is required attribute');
  //   if (!transfer.ammount) throw new ValidationError('Ammount is required attribute');
  //   if (!transfer.date) throw new ValidationError('Date is required attribute');
  //   if (!transfer.acc_ori_id) throw new ValidationError('Origin account ID is required attribute');
  //   if (!transfer.acc_dest_id) throw new ValidationError('Destination account ID is required attribute');
  //   if (transfer.acc_ori_id === transfer.acc_dest_id) throw new ValidationError('Can\'t transfer to same account');

  //   const accounts = await app.db('accounts').whereIn('id', [transfer.acc_dest_id, transfer.acc_ori_id]);

  //   accounts.forEach(acc => {
  //     if (acc.user_id !== parseInt(transfer.user_id, 10)) throw new ValidationError('Account doesn\'t belongs to user');
  //   });
  // };

  return {  };
};
